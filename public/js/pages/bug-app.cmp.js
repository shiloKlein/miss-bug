'use strict'
import { bugService } from '../services/bug-service.js'
import { userService } from '../services/user.service.js'
import bugList from '../cmps/bug-list.cmp.js'
import usersList from '../cmps/users-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <button @click="setPage(-1)" :disabled="!this.filterBy.page">prev</button>
        <span>{{filterBy.page}}</span>

        <button @click="setPage(1)" :disabled="this.filterBy.page===this.totalPage-1">next</button>

        <bug-list v-if="bugs && !userList" :bugs="bugs" @removeBug="removeBug"></bug-list>

        <users-list v-if="userList && users" :users="users"/>

        <button @click="saveAsPdf(bugs)">Creat PDF</button>
        <a v-if="pdfUrl" :href="pdfUrl" target="_blank">open pdf bugs</a>
        <button @click="openUsersList">users list</button>
    </section>
    `,
  data() {
    return {
      bugs: null,
      users: null,
      filterBy: {
        title: '',
        page: 0
      },
      totalPage: 0,
      pdfUrl: null,
      userList: false,
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy).then(({ filteredBugs, totalPages }) => {
        console.log(totalPages);
        this.bugs = filteredBugs
        this.totalPage = +totalPages
      })
    },
    setFilterBy(filterBy) {
      this.filterBy = { ...filterBy, page: this.filterBy.page }
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId)
        .then(() => this.loadBugs())
        .catch(console.log)
    },
    setPage(dif) {
      this.filterBy.page += dif
      this.loadBugs()
    },
    saveAsPdf(bugs) {
      bugService.saveAsPdf(bugs)
        .then(pdfUrl => {
          console.log(pdfUrl)
          this.pdfUrl = pdfUrl
        })
    },
    openUsersList() {
      this.userList = !this.userList
      userService.query()
        .then(users => {
          this.users = users
          console.log(this.users);
        })
    }
  },
  computed: {
    bugsToDisplay() {
      if (!this.filterBy?.title) return this.bugs
      return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
    },
  },
  components: {
    bugList,
    bugFilter,
    usersList
  },
}
