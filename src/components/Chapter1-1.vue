<template>
  <div>
    <ul>
      <li v-for="(item, index) in entryeditors" :key="index">{{item.id}} {{item.name}}</li>
    </ul>
    <br/>
    <label>
      词条名称
      <input placeholder="请输入新词条名称" v-model="newName">
    </label>
    <button @click="createNewEditor">新增</button>
  </div>
</template>

<script>
export default {
  name: 'Chapter1-1',
  data: function () {
    return {
      entryeditors: [],
      newName: ''
    }
  },
  methods: {
    createNewEditor: function () {
      this.$axios.post('http://localhost:8000/entryeditor/entryeditor/', {'name': this.newName}).then(res => {
        console.log('create', res)
        this.entryeditors.push(res.data)
      })
    }
  },
  mounted () {
    this.$axios.get('http://localhost:8000/entryeditor/entryeditor/').then(res => {
      console.log('get', res)
      this.entryeditors = res.data
    })
  }
}
</script>

<style scoped>

</style>
