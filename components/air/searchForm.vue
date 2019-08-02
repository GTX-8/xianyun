<template>
    <div class="search-form">

        <!-- 头部tab切换 -->
        <el-row type="flex" class="search-tab">
            <span v-for="(item, index) in tabs" :key="index"
            @click="handleSearchTab(item, index)"
            :class="{active: index === currentTab}">
                <i :class="item.icon"></i>{{item.name}}
            </span>
        </el-row>

        <el-form class="search-form-content" ref="form" label-width="80px" :model="form">
            <el-form-item label="出发城市">
                <!-- fetch-suggestions 返回输入建议的方法 -->
                <!-- select 点击选中建议项时触发 -->
                <el-autocomplete
                :fetch-suggestions="queryDepartSearch"
                placeholder="请搜索出发城市"
                @select="handleDepartSelect"
                class="el-autocomplete"
                v-model="form.departCity"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="到达城市">
                <el-autocomplete
                :fetch-suggestions="queryDestSearch"
                placeholder="请搜索到达城市"
                @select="handleDestSelect"
                class="el-autocomplete"
                v-model="form.destCity"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="出发时间">
                <!-- change 用户确认选择日期时触发 -->
                <el-date-picker type="date" 
                placeholder="请选择日期" 
                style="width: 100%;"
                v-model="form.departDate"
                @change="handleDate">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="">
                <el-button style="width:100%;" 
                type="primary" 
                icon="el-icon-search"
                @click="handleSubmit">
                    搜索
                </el-button>
            </el-form-item>
            <div class="reverse">
                <span @click="handleReverse">换</span>
            </div>
        </el-form>  
      </div>
</template>

<script>
import moment from 'moment'
export default {
    data(){
        return {
            form:{
                departCity:'',//出发城市
                departCode:'',//出发城市代码
                destCity:'',//到达城市
                destCode:'',//到达城市代码
                departDate:''//日期字符串
            },
            tabs: [
                {icon: "iconfont icondancheng", name: "单程"},
                {icon: "iconfont iconshuangxiang", name: "往返"}
            ],
            currentTab: 0,
        }
    },
    methods: {
        // tab切换时触发
        handleSearchTab(item, index){
            this.$alert('目前暂不支持往返,请使用单程机票!','提示',{type:error})
        },
        // 出发城市输入框获得焦点时触发
        // value 是选中的值，cb是回调函数，接收要展示的列表,接收的参数格式是固定的,必须是一个数组,数组中每一项必须是一个对象
        //对象中必需包含 value属性
        queryDepartSearch(value, cb){
            //输入框没有值的时候返回
            if(!value){
                cb([])
                return
            }
            //获取城市列表
            this.$axios({
                url:'/airs/city',
                //设置get请求的参数
                params:{
                    name:value
                }
            }).then(res=>{
                const {data} = res.data
                // 循环给每一项数据添加一个value属性
                const newData = data.map(v=>{
                    v.value = v.name.replace('市',"") //城市名称
                    return v
                })
                //设置第一个为选中的默认值
                this.form.departCity = newData[0].value
                this.form.departCode = newData[0].sort
                cb(newData)
            })
        },

        // 目标城市输入框获得焦点时触发
        // value 是选中的值，cb是回调函数，接收要展示的列表
        queryDestSearch(value, cb){
            if(!value){
                cb([])
                return
            }
            this.$axios({
                url:'/airs/city',
                params: {
                    name: value
                }
            }).then(res=>{
                console.log(res)
                const {data} = res.data
                const newData = data.map(v=>{
                    v.value = v.name.replace('市','')
                    return v
                })
                this.form.destCity = newData[0].value
                this.form.destCode = newData[0].sort
                cb(newData)
            })
        },
       
        // 出发城市下拉选择时触发
        handleDepartSelect(item) {
            //赋值给出发城市
            this.form.departCity = item.name
            //赋值给触发城市代码
            this.form.departCode = item.sort
        },

        // 目标城市下拉选择时触发
        handleDestSelect(item) {
            this.form.destCity = item.name
            this.form.destCode = item.sort
        },

        // 确认选择日期时触发
        handleDate(value){
           this.form.departDate = moment(value).format("YYYY-MM-DD")
           console.log(this.form.departDate)
        },

        // 触发和目标城市切换时触发
        handleReverse(){
            const {departCity,departCode,destCity,destCode} = this.form
            this.form.departCity = destCity
            this.form.departCode = destCode
            this.form.destCity = departCity
            this.form.destCode = departCode
        },

        // 提交表单是触发
        handleSubmit(){
           if(!this.form.departCity){
               this.$alert('出发城市不能为空','提示',{type:'warning'})
               return 
           }
           if(!this.form.destCity){
               this.$alert('到达城市不能为空','提示',{type:'warning'})
               return
           }
           if(!this.form.departDate){
               this.form.departDate = moment(new Date()).format('YYYY-MM-DD')
               this.$alert('出发时间以默认填写为本天','提示',{type:'warning'})
               return
           }
           //跳转机票列表页
           this.$router.push({
               path:'/air/flights',
               query:this.form
           })
        }
    }
}
</script>

<style scoped lang="less">
.search-form{
    border:1px #ddd solid;
    border-top:none;
    width:360px;
    height:350px;
    box-sizing: border-box;
}

.search-tab{
  span{
    display: block;
    flex:1;
    text-align: center;
    height:48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top:3px #eee solid;
    background:#eee;
  }

  .active{
    border-top-color: orange;
    background:#fff;
  }

  i{
    margin-right:5px;
    font-size: 18px;

    &:first-child{
      font-size:16px;
    }
  }
}

.search-form-content{
  padding:15px 50px 15px 15px;
  position: relative;

  .el-autocomplete{
    width: 100%;
  }
}

.reverse{
  position:absolute;
  top: 35px;
  right:15px;

  &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:-35px;
      width:25px;
      height:1px;
      background:#ccc;
  }

  &:after{
      top:0;
    }

    &:before{
      top:60px;
    }

  span{
    display: block;
    position:absolute;
    top: 20px;
    right:0;
    font-size:12px;
    background: #999;
    color:#fff;
    width:20px;
    height:20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:10px;
      width:1px;
      height:20px;
      background:#ccc;
    }

    &:after{
      top:-20px;
    }

    &:before{
      top:20px;
    }
  }
}
</style>