<script setup>
import { ref, onMounted, computed, defineExpose, defineEmits } from "vue";
import axios from "redaxios";
import { useTokenStore } from "../stores/token";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const props = defineProps({
  isRegister: {
    type: Boolean,
    default: false,
  },
  endpoint: String,
  listName: String,
  formatFunction: Function,
});

const tokenStore = useTokenStore();

const data = ref()


const activeNames = ref([]);

const activeBookLists = ref([])

const columns = computed(() => {
  if (!data.value) return []
  return Object.keys(data.value?.[0])
})


const fetchEndpoint = () => {
  axios.get(`http://localhost:8080/api/${props.endpoint}`, tokenStore.requestConfig).then((response) => {
    data.value = response.data._embedded?.[props.listName].reverse()
    })

}

const emit = defineEmits(['delete', 'edit'])

const handleDelete = (id) => {
  emit('delete', id)
}

const handleEdit = (id) => {
  emit('edit', id)
}

defineExpose({fetchEndpoint})

onMounted(() => {
  if (tokenStore.requestConfig) {

    fetchEndpoint();
  }

})

</script>

<template>
<div class="container">
  <van-collapse v-model="activeNames">
    <van-collapse-item  v-for="item in data" :key="item.id" 
    :title="item.name && item.surname ? item.name + ' ' + item.surname : (item.title || item.name )" :name="item.id">
      <div class="actions">
        <van-icon @click="handleEdit(item.id)" name="edit" size="2.5rem" />
        <van-icon @click="handleDelete(item.id)" name="delete" size="2.5rem" />
      </div>
      <div v-for="field in columns" :key="field" class="field">
        <div v-if="field === 'books' && field.length" >
          <span>Książki: </span>
          <van-collapse class="books" v-model="activeBookLists">
            <van-collapse-item  v-for="book in item[field]" :key="book.id" :title="book.title">
              <div v-for="bookField in Object.keys(book)" :key="bookField" >
                <span>{{ bookField }} : {{ book[bookField] || "Brak" }}</span> 
              </div>
            </van-collapse-item>
          </van-collapse>
        </div>
        <span v-else>{{ field }} : {{ item[field] || "Brak" }}</span> 
      </div>
    </van-collapse-item>
  </van-collapse>
</div>

</template>

<style>
.container {
  margin-top: 80px;
}
.field {
  margin: 8px 0;
}
span {
  padding: 0 10px;
  font-weight: 700;
}
.books {
  margin: 10px 0;
}
.actions {
  display: flex;
  gap: 20px;
  margin: 10px 0;
  justify-content: end;
  cursor: pointer;
}
</style>
