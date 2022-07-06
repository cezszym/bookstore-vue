<script setup>
import DataTable from '../components/DataTable.vue';
import { reactive, ref, onMounted } from "vue";
import axios from "redaxios";
import { useTokenStore } from "../stores/token";
import { Toast } from "vant";

const showModal = ref(false)

const formData = reactive({
  title: null,
  description: null,
  price: null,
  year: null,
  author_id: null,
  category_id: null
})

const authorsList = ref([])

const tokenStore = useTokenStore();

const openModal = () => {
  showModal.value = true
}
const dataComponent = ref()

const getAuthorsList = () =>  {
      axios
      .get(`http://localhost:8080/api/authors`, tokenStore.requestConfig)
      .then((response) => {
        if (response.data?._embedded?.authorList) {
          authorsList.value = [...response.data._embedded.authorList]
          formData.author_id = authorsList.value[0].id
        }
      })
      .catch((error) => {
        Toast.fail({
          message: error.status === 401 ? "Brak uprawnień dla operacji" : error.data,
        });
      })
}

const categoriesList = ref([])

const getCategoriesList = () =>  {
      axios
      .get(`http://localhost:8080/api/categories`, tokenStore.requestConfig)
      .then((response) => {
        if (response.data?._embedded?.categoryList) {
          categoriesList.value = [...response.data._embedded.categoryList]
          formData.category_id = categoriesList.value[0].id
        }
      })
      .catch((error) => {
        Toast.fail({
          message: error.status === 401 ? "Brak uprawnień dla operacji" : error.data,
        });
      })
}

onMounted(() => {
  getAuthorsList()
  getCategoriesList()
})

const createBook = () => {
    axios
      .post("http://localhost:8080/api/books", formData, tokenStore.requestConfig)
      .then((response) => {
        Toast.success({
          message: "Dodano książkę",
        });
        dataComponent.value.fetchEndpoint();
        formData.name = null
        formData.description = null
        formData.price = null
        formData.year = null

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

const deleteBook = (id) => {
      axios
      .delete(`http://localhost:8080/api/books/${id}`, tokenStore.requestConfig)
      .then((response) => {
        Toast.success({
          message: "Usunięto użytkownika",
        });
        dataComponent.value.fetchEndpoint();
      })
      .catch((error) => {
        Toast.fail({
          message: error.status === 401 ? "Brak uprawnień dla operacji" : error.data,
        });
      })
}

const fetchBook = (id) => {
      axios
      .get(`http://localhost:8080/api/books/${id}`, tokenStore.requestConfig)
      .then((response) => {
        if (response.data) {
          formData.title = response.data.title
          formData.description = response.data.description
          formData.price = response.data.price
          formData.year = response.data.year
          editedBookId.value = response.data.id
          openModal()
        }
      })
      .catch((error) => {
        Toast.fail({
          message: error.status === 401 ? "Brak uprawnień dla operacji" : error.data,
        });
      })
}

const editBook = (id) => {
      axios
      .put(`http://localhost:8080/api/books/${id}`, formData, tokenStore.requestConfig)
      .then((response) => {
        Toast.success({
          message: "Zmiany zapisane",
        });
        dataComponent.value.fetchEndpoint();
        formData.title = null
        formData.description = null
        formData.price = null
        formData.year = null

      })
      .catch((error) => {

        Toast.fail({
          message: error.status === 401 ? "Brak uprawnień dla operacji" : error.data,
        });
      })
      .finally(() => {
        showModal.value = false;
        editedBookId.value = null
      });
}

const editedBookId = ref(null)

const startEditing = (id) => {
  fetchBook(id)
}

const submitForm = () => {
  if (!editedBookId.value) {
    createBook()
  } else {
    editBook(editedBookId.value)
  }
}

</script>

<template>
  <div>
    <h1>Książki <van-icon @click="openModal" name="plus" /></h1>
    <DataTable @delete="deleteBook" @edit="startEditing" ref="dataComponent" endpoint="books" list-name="bookList"/>
    <van-popup v-model:show="showModal">
          <van-form class="form" @submit="submitForm">
      <van-cell-group inset>
        <van-field
          v-model="formData.title"
          name="title"
          label="title"
          placeholder="Podaj title"
        />
        <div class="select">
            <label for="authors">author</label>
            <select class="select" v-model="formData.author_id" name="authors">
              <option v-for="author in authorsList" :key="author.id" :value="author.id">{{ author.name }} {{ author.surname }}</option>
            </select>
        </div>
        <div class="select">
            <label for="categories">category</label>
            <select class="select" v-model="formData.category_id" name="categories">
              <option v-for="category in categoriesList" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
        </div>
        <van-field
          v-model="formData.description"
          name="description"
          label="description"
          placeholder="Podaj description"
        />
        <van-field
          v-model="formData.price"
          name="price"
          label="price"
          type="number"
          placeholder="Podaj price"
        />
        <van-field
          v-model="formData.year"
          name="year"
          label="year"
          type="number"
          placeholder="Podaj year"
        />
      </van-cell-group>
      <div style="margin: 16px">
      <van-button
        v-if="editedBookId"
        block
        type="primary"
        color="#42b883"
        native-type="submit"
      >
        Edytuj książkę
      </van-button>
      <van-button
        v-else
        block
        type="primary"
        color="#42b883"
        native-type="submit"
      >
        {{editedBookId ? 'Edytuj książkę' : 'Dodaj książkę' }}
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
.select {
  width: 100%;
  margin: 15px 0;
}
select {
    height: 30px;
    border: 1px solid grey;
}
</style>