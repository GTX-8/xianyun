<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item,index) in users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in data.insurances" :key="index">
          <el-checkbox :label="`${item.type}：￥${item.price}/份×${users.length}  最高赔付${item.compensation}`"
           @change="handleInsurance(item.id)"
           border></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit" :disabled="pd">提交订单</el-button>
        <input type="hidden" :value="allPrice">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pd:false,
      users: [{ username: "", id: "" }],
      insurances:[], //保险数据
      contactName:"", //联系人名字
      contactPhone:"", //联系人电话
      captcha:'', //验证码
      invoice: false //发票
    };
  },
  props:{
    //   接受父组件传过来的机票数据
      data:{
        type:Object,
        default:{}
      }
      
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.users = [...this.users,{username:'',id:''}];
    },

    // 移除乘机人
    handleDeleteUser(index) {
        this.users.splice(index,1)
    },

    //选择保险
    handleInsurance(id){
        // 如果存在一样的数据便在数组里面删除那个数据
        if(this.insurances.indexOf(id)>-1){
            //slice从该数组索引位置截取时
            let arr = this.insurances.slice(0)
            //从该数组索引位置删除
            arr.splice(this.insurances.indexOf(id),1)
            this.insurances = arr
        }else{
        this.insurances = [...new Set([...this.insurances,id])]
        }
        console.log(this.insurances)
    },
    // 发送手机验证码
    handleSendCaptcha() {//联系人电话
        this.$axios({
            url:'/captchas',
            method:'POST',
            data:{
                tel:this.contactPhone
            }
        }).then(res=>{
            const {code} = res.data
            this.$alert(`您的手机验证码为:${code}`,'提示',{type:'success'})
        })
    },

    // 提交订单
    handleSubmit() {
        const {id,seat_xid} = this.$route.query
        const orderData = {
            users: this.users,
            insurances: this.insurances,
            contactName: this.contactName,
            contactPhone: this.contactPhone,
            invoice: this.invoice,
            captcha:this.captcha,
            air: id,
            seat_xid
        }
        //判断表单验证是否通过
        let valid = true
        //验证乘机人信息
        this.users.forEach(v=>{
            if(!v.username||!v.id){
                this.$message.warning("乘机人信息不能为空")
                valid=false
            }
        })
        //如果valid为false结束
        if(!valid){
            return
        }
        //验证联系人信息
        if(!this.contactName){
            this.$message.warning("请填写联系人姓名")
            return
        }
         if(!this.contactPhone){
            this.$alert('手机号码不能为空','提示',{type:'warning'})
            return 
        }
        this.$axios({
            url:'/airorders',
            method:'POST',
            data: {...orderData},
            headers:{
                //JWT是后台的token标准,前端只管传递一个Bearer
                 Authorization:`Bearer ${this.$store.state.user.userInfo.token}`
            }
        }).then(res=>{
            if(res.data.status===0){
                this.$message.success(res.data.message)
                this.pd=true
                setTimeout(()=>{
                    this.$router.push('/')
                },1500)
            }
        })

    }
    
},


computed: {
        allPrice(){
            let obj = {
                price:0,
                num: this.users.length
            }
            if(!this.data.seat_infos){
                return 0
            }
            // 飞机票单价
            obj.price += this.data.seat_infos.org_settle_price
            //燃油费
           obj.price += this.data.airport_tax_audlet
            //保险'
            // obj.price += this.insurances.length*30
            
            if(this.insurances){
                this.insurances.forEach(item=>{
                    this.data.insurances.forEach(item2=>{
                        if(item === item2.id){
                            obj.price+= item2.price
                        }
                    })
                })
            }
            //人数
            obj.price  *= this.users.length
            // 把数据返回给父组件
            this.$emit('setAllPrice',obj)
            return obj

        }
    }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>