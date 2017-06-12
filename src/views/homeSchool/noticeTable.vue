<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      
      <el-button class="filter-item" v-waves style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">发通知</el-button>
      <el-button class="filter-item" v-waves type="primary" icon="delete">删除</el-button>
     
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="公告标题" v-model="listQuery.title">
      </el-input>
      <el-select @change='handleFilter' clearable style="width: 90px" class="filter-item" v-model="listQuery.status" placeholder="状态">
        <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter_zh" :value="item">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table  :default-sort = "{prop: 'pageviews', order: 'descending'}"  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row  style="" height="730">
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.notice_id }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.readed }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.unRead }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.id }}</span>
            </el-form-item>
             <!--<el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item> -->
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="notice_id" align="center" label="序号" width="70" sortable>
        <template scope="scope">
          <span>{{scope.row.notice_id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" show-overflow-tooltip label="标题">
        <template scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="beginTime" width="180px" align="center" label="创建时间" sortable>
        <template scope="scope">
          <span>{{scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i} 星期{a}')}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="publicTime" width="180px" align="center" label="发布时间" sortable>
        <template scope="scope">
          <span>{{scope.row.publicTime | parseTime('{y}-{m}-{d} {h}:{i} 星期{a}')}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="pageviews" align="center" label="阅读数" width="120" sortable>
        <template scope="scope">
          <span class="link-type" @click='handleFetchPv(scope.row.pageviews)'>{{scope.row.pageviews}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="readed" width="110px" align="center" label="已读" sortable>
        <template scope="scope">
          <span class="link-type" @click='handleFetchPv(scope.row.pageviews)'>{{scope.row.readed}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="unRead" width="110px" align="center" label="未读" sortable>
        <template scope="scope">
          <span class="link-type" @click='handleFetchPv(scope.row.pageviews)'>{{scope.row.unRead}}</span>
        </template>
      </el-table-column>

       <el-table-column class-name="status-col" label="状态" width="90">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusFilter_zh}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column  align="left" label="操作" width="150">
        <template scope="scope">
        <el-tooltip v-if="scope.row.status!='published'" class="item" effect="dark" content="发布" placement="top">
            <el-button v-if="scope.row.status!='published'" icon="message" size="small" type="success" @click="handleModifyStatus(scope.row,'published')">
            </el-button>
        </el-tooltip>
        <el-tooltip v-if="scope.row.status!='published'" class="item" effect="dark" content="编辑" placement="top">
            <el-button v-if="scope.row.status!='published'"  icon="edit"  size="small" @click="handleUpdate(scope.row)">
            </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button  icon="delete" size="small" type="danger" @click="handleDelete(scope.row)">
            </el-button>
        </el-tooltip>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="类型">
          <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select class="filter-item" v-model="temp.status" placeholder="请选择">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="标题">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>

        <el-form-item label="重要性">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </el-form-item>

        <el-form-item label="点评">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="阅读数统计" :visible.sync="dialogPvVisible" size="small">
       <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
          <el-table-column prop="key" label="渠道"> </el-table-column>
          <el-table-column  prop="pv" label="pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确 定</el-button>
      </span>
    </el-dialog >

  </div>
</template>

<script>
    import { fetchList } from 'api/notice_table';
    import { parseTime } from 'utils';

    const calendarTypeOptions = [
      { key: 'FD', display_name: '经济数据' },
      { key: 'FE', display_name: '财经大事' },
      { key: 'BI', display_name: '国债发行' },
      { key: 'VN', display_name: '假期报告' }
    ];

    // arr to obj
    const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
      acc[cur.key] = cur.display_name;
      return acc
    }, {});

    export default {
      name: 'table_demo',
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 20,
            title: undefined,
            status: undefined
          },
          temp: {
            id: undefined,
            importance: 0,
            remark: '',
            timestamp: 0,
            title: '',
            type: '',
            status: 'published'
          },
          importanceOptions: [1, 2, 3],
          statusOptions: ['published', 'unPublish'],
          calendarTypeOptions,
          sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
          dialogFormVisible: false,
          dialogStatus: '',
          textMap: {
            update: '编辑',
            create: '创建'
          },
          dialogPvVisible: false,
          pvData: [],
          showAuditor: false,
          tableKey: 0
        }
      },
      created() {
        this.getList();

      },
      mounted() {
        //测试jQuery 写法
        var aa = $(".el-button");
        console.log(aa);
      },
      filters: {
        statusFilter(status) {
          const statusMap = {
            published: 'success',
            unPublish: 'danger'
          };
          return statusMap[status]
        },
        statusFilter_zh(status) {
          const statusMap = {
            published: '已发布',
            unPublish: '未发布'
          };
          return statusMap[status]
        },
        typeFilter(type) {
          return calendarTypeKeyValue[type]
        }
      },
      methods: {
        getList() {
          /*console.log(this.listQuery);
          this.listLoading = true;
          fetchList(this.listQuery).then(response => {
            this.list = response.data.items;
            this.total = response.data.total;
            this.listLoading = false;
            console.log(this.list);
          })*/
          let AV =  this.$AV;
          /*var query = new AV.Query('noticeTable');
            query.find().then(function (data) {
              // 成功获得实例
              // this.listLoading = false;
              // data.forEach(function (item) {
              //   alert(item)
              // })
              console.log(data[0].get());
            }, function (error) {
              // 异常处理
            });*/
            /*limit:10,
            page:1,
            status:undefined,
            title:undefined*/
            console.log(this.listQuery);
            const that = this;
            var cql = 'select count(*), * from noticeTable limit '+(this.listQuery.page-1)*this.listQuery.limit+','+this.listQuery.limit;
            AV.Query.doCloudQuery(cql).then(function (data) {
              console.log(data);
                // results 即为查询结果，它是一个 AV.Object 数组
                var results = data.results;
                let list = data.results.map(item => {
                  item.attributes['id'] = item.id;
                  return item.attributes
                })
                that.list = list;
                that.total = data.count;
                that.listLoading = false;
                console.log(data.count);
                console.log(that.list);
            }, function (error) {

            });         
        },
        handleFilter() {
          this.getList();
        },
        handleSizeChange(val) {
          this.listQuery.limit = val;
          this.getList();
        },
        handleCurrentChange(val) {
          this.listQuery.page = val;
          this.getList();
        },
        timeFilter(time) {
          if (!time[0]) {
            this.listQuery.start = undefined;
            this.listQuery.end = undefined;
            return;
          }
          this.listQuery.start = parseInt(+time[0] / 1000);
          this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000);
        },
        handleModifyStatus(row, status) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          row.status = status;
        },
        handleCreate() {
          let AV = this.$AV;
          let that = this;
          var noticeTable = AV.Object.extend('noticeTable');
          var noticeTable = new noticeTable();
          noticeTable.set('title', '工程师周会');
          noticeTable.set('status', 'unPublish');
          noticeTable.set('publicTime', 833762972169);
          noticeTable.set('beginTime', 833762972169);
          noticeTable.set('notice_id', 2);
          noticeTable.set('readed', 1213);
          noticeTable.set('unRead', 23341);
          noticeTable.save().then(function (todo) {
            // 成功保存之后，执行其他逻辑.
            console.log('New object created with objectId: ' + todo.id);
            that.getList();
          }, function (error) {
            // 异常处理
            console.error('Failed to create new object, with error message: ' + error.message);
          });
          
          /*this.resetTemp();
          this.dialogStatus = 'create';
          this.dialogFormVisible = true;*/
        },
        handleUpdate(row) {
          this.temp = Object.assign({}, row);
          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        },
        handleDelete(row) {
          /*this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });*/
          
          // 执行 CQL 语句实现删除一个 Todo 对象
          let AV = this.$AV;
          let that = this;
          AV.Query.doCloudQuery('delete from noticeTable where objectId="'+row.id+'"').then(function () {
            // 删除成功
               const index = that.list.indexOf(row);
                that.list.splice(index, 1);
                that.getList();
          }, function (error) {
            // 异常处理
          });
          /*var todo = AV.Object.createWithoutData('noticeTable', row.id);
          todo.destroy().then(function (success) {
            // 删除成功
                const index = that.list.indexOf(row);
                that.list.splice(index, 1);
                that.getList();
          }, function (error) {
            // 删除失败
          });*/

        },
        create() {
          this.temp.id = parseInt(Math.random() * 100) + 1024;
          this.temp.timestamp = +new Date();
          this.temp.author = '原创作者';
          this.list.unshift(this.temp);
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          });
        },
        update() {
          this.temp.timestamp = +this.temp.timestamp;
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v);
              this.list.splice(index, 1, this.temp);
              break;
            }
          }
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          });
        },
        resetTemp() {
          this.temp = {
            id: undefined,
            importance: 0,
            remark: '',
            timestamp: 0,
            title: '',
            status: 'published',
            type: ''
          };
        },
        handleFetchPv(pv) {
          /*fetchPv(pv).then(response => {
            this.pvData = response.data.pvData;
          })*/
            this.dialogPvVisible = true;
        }
      }
    }
</script>
<style lang="scss" scope>
  .el-button+.el-button {
      margin-left: 0px;
  }
  .el-table .cell, .el-table th>div{
    padding: 0 8px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
