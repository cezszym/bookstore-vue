<script setup>
import DataTable from '../components/DataTable.vue';
import { reactive, ref, computed } from "vue";
import axios from "redaxios";
import { useTokenStore } from "../stores/token";
import { Toast } from "vant";

const showModal = ref(false)

const formData = reactive({
  name: null,
})

const tokenStore = useTokenStore();

const openModal = () => {
  showModal.value = true
}
const dataComponent = ref()

const createCategory = () => {
    axios
      .post("http://localhost:8080/api/categories", formData, tokenStore.requestConfig)
      .then((response) => {
        Toast.success({
          message: "Dodano kategorię",
        });
        dataComponent.value.fetchEndpoint();
        formData.name = null
      })
      .catch((error) => {
        Toast.fail({
          message: error.status === 401 ? "Brak uprawnień dla operacji" : error.data,
        });
      })
      .finally(() => {
        showModal.value = false;
      });
}

const deleteCategory = (id) => {
      axios
      .delete(`http://localhost:8080/api/categories/${id}`, tokenStore.requestConfig)
      .then((response) => {
        Toast.success({
          message: "Usunięto kategorię",
        });
        dataComponent.value.fetchEndpoint();
      })
      .catch((error) => {
        Toast.fail({
          message: error.status === 401 ? "Brak uprawnień dla operacji" : error.data,
        });
      })
}

const fetchCategory = (id) => {
      axios
      .get(`http://localhost:8080/api/categories/${id}`, tokenStore.requestConfig)
      .then((response) => {
        if (response.data) {
          formData.name = response.data.name
          editedCategoryId.value = response.data.id
          openModal()
        }
      })
      .catch((error) => {
        Toast.fail({
          message: error.status === 401 ? "Brak uprawnień dla operacji" : error.data,
        });
      })
}

const editCategory = (id) => {
      axios
      .put(`http://localhost:8080/api/categories/${id}`, formData, tokenStore.requestConfig)
      .then((response) => {
        Toast.success({
          message: "Zmiany zapisane",
        });
        dataComponent.value.fetchEndpoint();
        formData.name = null
        formData.surname = null
        formData.nationality = null
        formData.yearOfBirth = null
        formData.gender = null
      })
      .catch((error) => {

        Toast.fail({
          message: error.status === 401 ? "Brak uprawnień dla operacji" : error.data,
        });
      })
      .finally(() => {
        showModal.value = false;
        editedCategoryId.value = null
      });
}

const editedCategoryId = ref(null)

const startEditing = (id) => {
  fetchCategory(id)
}

const submitForm = () => {
  if (!editedCategoryId.value) {
    createCategory()
  } else {
    editCategory(editedCategoryId.value)
  }
}

</script>

<template>
  <div>
    <h1>Kategorie <van-icon @click="openModal" name="plus" /></h1>
    <DataTable @delete="deleteCategory" @edit="startEditing" ref="dataComponent" endpoint="categories" list-name="categoryList"/>
    <van-popup v-model:show="showModal">
          <van-form class="form" @submit="submitForm">
      <van-cell-group inset>
        <van-field
          v-model="formData.name"
          name="name"
          label="name"
          placeholder="Podaj name"
        />
  
      </van-cell-group>
      <div style="margin: 16px">
      <van-button
        v-if="editedCategoryId"
        block
        type="primary"
        color="#42b883"
        native-type="submit"
      >
        Edytuj autora
      </van-button>
      <van-button
        v-else
        block
        type="primary"
        color="#42b883"
        native-type="submit"
      >
        {{editedCategoryId ? 'Edytuj kategorię' : 'Dodaj kategorię' }}
      </van-button>
      </div>
    </van-form>
    </van-popup>
  </div>
</template>

<style>
.form {
  padding: 10px 30px;
  width: 100%;
}
</style>