'use strict'

import { bugService } from '../services/bug-service.js'

export default {
  template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <span>{{bug.description}}</span>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      const value = document.cookie
      const parts = value.split(`;`)
      if(parts[0].includes('visitedCount'))parts[0]=''
      console.log(parts)
      bugService.getById(bugId).then((bug) => {
        console.log(bug);
        this.bug = bug
      })
    }
  },
}
