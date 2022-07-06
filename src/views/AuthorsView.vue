<script setup>
import DataTable from '../components/DataTable.vue';
import { reactive, ref, computed } from "vue";
import axios from "redaxios";
import { useTokenStore } from "../stores/token";
import { Toast } from "vant";

const showModal = ref(false)

const formData = reactive({
  name: null,
  surname: null,
  nationality: null,
  yearOfBirth: null,
  gender: null,
})

const tokenStore = useTokenStore();

const openModal = () => {
  showModal.value = true
}
const dataComponent = ref()

const createAuthor = () => {
    axios
      .post("http://localhost:8080/api/authors", formData, tokenStore.requestConfig)
      .then((response) => {
        Toast.success({
          message: "Dodano autora",
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
      });
}

const deleteAuthor = (id) => {
      axios
      .delete(`http://localhost:8080/api/authors/${id}`, tokenStore.requestConfig)
      .then((response) => {
        Toast.success({
          message: "Usunięto autora",
        });
        dataComponent.value.fetchEndpoint();
      })
      .catch((error) => {
        Toast.fail({
          message: error.status === 401 ? "Brak uprawnień dla operacji" : error.data,
        });
      })
}

const fetchAuthor = (id) => {
      axios
      .get(`http://localhost:8080/api/authors/${id}`, tokenStore.requestConfig)
      .then((response) => {
        if (response.data) {
          formData.name = response.data.name
          formData.surname = response.data.surname
          formData.nationality = response.data.nationality
          formData.yearOfBirth = response.data.yearOfBirth
          formData.gender = response.data.gender
          editedAuthorId.value = response.data.id
          openModal()
        }
      })
      .catch((error) => {
        Toast.fail({
          message: error.status === 401 ? "Brak uprawnień dla operacji" : error.data,
        });
      })
}

const editAuthor = (id) => {
      axios
      .put(`http://localhost:8080/api/authors/${id}`, formData, tokenStore.requestConfig)
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
        editedAuthorId.value = null
      });
}

const editedAuthorId = ref(null)

const startEditing = (id) => {
  fetchAuthor(id)
}

const submitForm = () => {
  if (!editedAuthorId.value) {
    createAuthor()
  } else {
    editAuthor(editedAuthorId.value)
  }
}

</script>

<template>
  <div>
    <h1>Autorzy <van-icon @click="openModal" name="plus" /></h1>
    <DataTable @delete="deleteAuthor" @edit="startEditing" ref="dataComponent" endpoint="authors" list-name="authorList"/>
    <van-popup v-model:show="showModal">
          <van-form class="form" @submit="submitForm">
      <van-cell-group inset>
        <van-field
          v-model="formData.name"
          name="name"
          label="name"
          placeholder="Podaj name"
        />
        <van-field
          v-model="formData.surname"
          name="surname"
          label="surname"
          placeholder="Podaj surname"
        />
        <van-field
          v-model="formData.nationality"
          name="nationality"
          label="nationality"
          placeholder="Podaj nationality"
        />
        <van-field
          v-model="formData.yearOfBirth"
          name="yearOfBirth"
          label="yearOfBirth"
          type="number"
          placeholder="Podaj yearOfBirth"
        />
        <van-field
          v-model="formData.gender"
          name="gender"
          label="gender"
          placeholder="Podaj gender"
        />
      </van-cell-group>
      <div style="margin: 16px">
      <van-button
        v-if="editedAuthorId"
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
        {{editedAuthorId ? 'Edytuj autora' : 'Dodaj autora' }}
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