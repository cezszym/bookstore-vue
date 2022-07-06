<script setup>
import { ref } from "vue";
import axios from "redaxios";
import { Toast } from "vant";
import { useRouter } from "vue-router";
import { useTokenStore } from "../stores/token";

const props = defineProps({
  isRegister: {
    type: Boolean,
    default: false,
  },
});

const tokenStore = useTokenStore();

const email = ref();
const password = ref();

const router = useRouter();

const onSubmit = () => {
  if (props.isRegister) {
    axios
      .post("http://localhost:8080/api/auth/register", {
        email: email.value,
        password: password.value,
      })
      .then((response) => {
        Toast.success({
          message: response.data,
        });
        router.push("/");
      })
      .catch((error) => {
        Toast.fail({
          message: error.data,
        });
      });
  } else {
    axios
      .post("http://localhost:8080/api/auth/login", {
        email: email.value,
        password: password.value,
      })
      .then((response) => {
        Toast.success({
          message: "Zalogowano",
        });
        tokenStore.setToken(response.data);
        router.push("books");
      })
      .catch((error) => {
        Toast.fail({
          message: error.data,
        });
      });
  }
};
</script>

<template>
  <van-form class="form" @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="email"
        name="Email"
        label="Email"
        type="email"
        placeholder="Podaj email"
        :rules="[{ required: true, message: 'Email jest wymagany' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="Hasło"
        label="Hasło"
        placeholder="Podaj hasło"
        :rules="[{ required: true, message: 'Hasło jest wymagane' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button
        v-if="isRegister"
        block
        type="primary"
        color="#42b883"
        native-type="submit"
      >
        Zarejestruj się
      </van-button>
      <van-button
        v-else
        block
        type="primary"
        color="#42b883"
        native-type="submit"
      >
        Zaloguj się
      </van-button>
    </div>
  </van-form>
</template>

<style>
.form {
  margin: 50px 0;
  width: 80%;
}
</style>
