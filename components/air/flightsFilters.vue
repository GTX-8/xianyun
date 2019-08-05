<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option
            v-for="(item,index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
            :value="`${item.from},${item.to}`"
            :label="`${item.from}:00-${item.to}:00`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option
            v-for="(item,index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
          <el-option
            v-for="(item,index) in sizeOptions"
            :key="index"
            :label="item.name"
            :value="item.size"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            airport: "",        // 机场
            flightTimes: "",    // 出发时间
            company: "",        // 航空公司
            airSize: "",        // 机型大小
            sizeOptions:[
                {name:'大',size:'L'},
                {name:'中',size:'M'},
                {name:'小',size:'S'},
            ],
            filters: {
                company:{value:'',key:'airline_name'},
                airport:{value:'',key:'org_airport_name'},
                planesize:{value:'',key:'plane_size'},
                time:{value:'',key:"dep_time"}
            },
            // time:''
                
        }
    },
    props:{
        data:{
            type:Object,
            default:{}
        }
    },
    methods: {
        //多选
        handleChange(){
            const arr = this.data.flights.filter(v=>{
                let pass = true
                Object.keys(this.filters).forEach(item=>{
                    if(!this.filters[item].value) return
                    if(Array.isArray(this.filters[item].value)){
                        const [from,to] = this.filters[item].value
                        const start = v.dep_time.split(':')[0]
                        if(+start<=+from || +start>+to){
                            pass = false
                        }
                    }else if(v[this.filters[item].key]!==this.filters[item].value){
                            pass = false
                    }
                })
                return pass
            })
            return arr
        },
        //多选
        // handleChange(arr2){
        //     const arr3 = arr2.filter(item=>{
        //         let pass = true
                
        //         Object.keys(this.filters).forEach(item2=>{
        //             if(!this.filters[item2].value) return
        //             if(Array.isArray(this.filters[item2].value)){
        //                 const [from,to] 
        //             }

        //             if(item[this.filters[item2].key] !== this.filters[item2].value){
        //                 pass= false
        //             }
        //         })
        //         return pass
        //     })
        //     return arr3
        // },
        // 时间条件
        // timeChange(){
        //     if(!this.time){
        //         return this.data.flights
        //     }else{
        //         const [from,to] = this.time.split(",")
        //         const arr1 = this.data.flights.filter(v=>{
        //         const start = v.dep_time.split(":")[0]
        //         return +start >= +from && +start <+to
        //         //0 6
        //         //09
        //         //09 >= 0   09< 6
        //         })
        //     return arr1
        //     }
            
        // },
        // 选择机场时候触发
        handleAirport(value){
            this.filters.airport.value = value
            const arr = this.handleChange()
            this.$emit('setDataList',arr)
            // console.log(value)
            // this.filters.airport.value = value
            // const arr2 = this.timeChange()
            // const arr = this.handleChange(arr2)
            // this.$emit('setDataList',arr)
            // const arr = this.data.flights.filter(v=>{
            //     return v.org_airport_name === value
            // })
            // this.$emit('setDataList',arr)
        },

        // 选择出发时间时候触发
        handleFlightTimes(value){
            this.filters.time.value = value.split(',')
            const arr = this.handleChange()
            this.$emit('setDataList',arr)
            // console.log(value)
            // this.time = value
            // const arr2 = this.timeChange()
            // const arr = this.handleChange(arr2)
            // this.$emit('setDataList',arr)
        },

         // 选择航空公司时候触发
        handleCompany(value){
            this.filters.company.value = value
            const arr = this.handleChange()
            this.$emit('setDataList',arr)
            // console.log(value)
            // this.filters.company.value = value
            // const arr2 = this.timeChange()
            // console.log(arr2);
            // const arr = this.handleChange(arr2)
            // console.log(arr);
            // this.$emit('setDataList',arr)
            // const arr = this.data.flights.filter(v=>{
            //     return v.airline_name === value
            // })
            // this.$emit('setDataList',arr)
        },

         // 选择机型时候触发
        handleAirSize(value){
            this.filters.planesize.value = value
            const arr = this.handleChange()
            this.$emit('setDataList',arr)
            // console.log(value)
            // this.filters.planesize.value = value
            // const arr2 = this.timeChange()
            // const arr = this.handleChange(arr2)
            // this.$emit('setDataList',arr)
        //    const arr = this.data.flights.filter(v=>{
        //         return v.plane_size === value
        //     })
        //     this.$emit('setDataList',arr)
        },
        
        // 撤销条件时候触发
        handleFiltersCancel(){
            this.airport= "",       // 机场
            this.flightTimes= ""   // 出发时间
            this.company= ""      // 航空公司
            this.airSize= ""       // 机型大小
            this.filters = {
                company:{value:'',key:'airline_name'},
                airport:{value:'',key:'org_airport_name'},
                planesize:{value:'',key:'plane_size'},
                time:{value:'',key:"dep_time"}
            }
            this.$emit('setDataList',this.data.flights)
        },
    }
}
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>