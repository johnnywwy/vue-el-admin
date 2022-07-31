<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-9 col-md-7 col-lg-5 m-auto pt-5">
          <div class="card mt-5">
            <div class="card-header bg-white ">
              <h3 class="text-center mb-0 text-secondary">{{ $conf.logo }}</h3>
            </div>
            <div class="card-body">
              <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item prop="username">
                  <el-input v-model="form.username" size="medium" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="form.password" size="medium" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="medium" class="w-100" @click="submit" :loading="false">
                    {{ loading ? '登录中...' : '立即登录' }}
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      loading: false,
      form: {
        username: 'admin',
        password: 'admin',
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate((e) => {
        if (!e) return;
        //提交表单
        this.loading = true
        this.axios.post('/admin/login', this.form
        ).then(res => {
          //  存储到vuex中
          //  存储到本地
          this.$store.commit('login', res.data.data)
          //  成功提示
          this.$message('登录成功')
          this.loading = false
          //  跳转页面
          this.$router.push({name: 'index'})
        }).catch((err) => {
          this.loading = false
        })
      })
    }
  }
};
</script>

<style>

</style>