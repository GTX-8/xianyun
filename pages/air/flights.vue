<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightsData" @setDataList="setDataList" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <div>
          <!-- flightsData.flights是后台返回的机票列表 -->
          <FlightsItem v-for="(item, index) in dataList" :key="index" :data="item" 
          v-show="(pageIndex-1)*pageSize<=index&&index<pageIndex*pageSize" />
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FlightsAside/>
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead.vue";
import FlightsItem from "@/components/air/flightsItem.vue";
import FlightsFilters from "@/components/air/flightsFilters.vue";
import FlightsAside from '@/components/air/flightsAside.vue'
export default {
  data() {
    return {
      // 后台返回的大的数据列表
      flightsData: {
        //航班总数据
        flights: [],
        info: {},
        options: {}
      },
      cacheFlightsData: {
        // 缓存一份数据，只会修改一次
        flights: [],
        info: {},
        options: {}
      },
      // 保存当前显示的列表数据
      dataList: [],
      // 当前页数
      pageIndex: 1,
      // 显示的条数
      pageSize: 6,
      // 总条数
      total: 0
    };
  },
  watch:{
    //监听路由信息的变化
    $route(){
      //请求新的数据,并将请求回来的页面页码为1
      this.pageIndex = 1
      this.getData()
    }
  },
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  methods: {
    // 修改分页条数时候触发
    handleSizeChange(value) {
      // 修改分页条数
      this.pageSize = value;
      // 获取分页的数据
      // this.getDataList();
    },
    // 切换页数时候触发
    handleCurrentChange(value) {
      // 修改页数
      this.pageIndex = value;
      // 获取分页的数据
      // this.getDataList();
    },
    // 获取分页的数据
    // getDataList() {
    //   // 修改dataList的数据 //0 | 2 //2 | 4
    //   this.dataList = this.flightsData.flights
    //   // slice
    //   // (
    //   //   (this.pageIndex - 1) * this.pageSize,
    //   //   (this.pageIndex - 1) * this.pageSize + this.pageSize
    //   // );
    // },
     //设置dataList的数据
    setDataList(arr) {
      //如果有条件删选出来显示在页面上并默认从第一页显示
      if (arr) {
        this.pageIndex = 1;
        this.flightsData.flights = arr;
        this.total = arr.length;
      }
      //删选结束后每页显示的数据
      console.log(this.dataList)
      this.dataList = this.flightsData.flights
    //   (
    //     (this.pageIndex - 1) * this.pageSize, 
    //     (this.pageIndex - 1) * this.pageSize+this.pageSize)
    // },
    //获取航班总数据
    },
    getData() {
      this.$axios({
        url: "airs",
        params: this.$route.query
      }).then(res => {
        this.dataList = res.data.flights
        this.flightsData = res.data;
        //缓存一份新的数据列表数据,这个列表不会被修改
        //flightsData会被修改
        this.cacheFlightsData = { ...res.data };
        // 获取总条数
        this.total = this.flightsData.flights.length;
        //切割出当前页面要显示的数据
        // this.dataList = this.flightsData.flights.slice(0,2)

      });
    }
},
  mounted() {
    this.getData()
  }
}
</script>

 <style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}
.flights-content {
  width: 745px;
  font-size: 14px;
}
.aside {
  width: 240px;
}
</style> 