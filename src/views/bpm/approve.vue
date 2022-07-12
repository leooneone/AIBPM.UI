<template>
    <section>
        <el-form :model="approveForm"  :rules="rules" ref="approveForm"  >

             <el-form-item prop="comment"    required>   

                      <el-input type="textarea" v-model="approveForm.comment"  />
                        </el-form-item>
                         <el-form-item prop="result"     required>    
                           
                        <el-radio-group v-model="approveForm.result">
                          <el-radio label="1" size="large" border>同意</el-radio>
                          <el-radio label="0" size="large" border>拒绝</el-radio>
                        </el-radio-group>
                    </el-form-item>
        </el-form>

    </section>
</template>
<script>
export  default{
  
    props:{  approveForm:{
      type:Object,default:{result:null,comment:''}}},
    data(){
        return {
                rules: {
                    comment: [
                        { required: true, message: '请输入意见', trigger: 'blur' },
                        { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
                    ],
                    result: [   { required: true, message: '请选择结论', trigger: 'change' }
                       
                    ],
                     
                    }
            }
         },methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}

</script>