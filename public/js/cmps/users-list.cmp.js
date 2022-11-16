'use strict'

import userPreview from './user-preview.cmp.js'

export default {
  props: ['users'],
  template: `
    <section v-if="users" class="user-list">                    
      <user-preview v-for="user in users" :user="user" :key="user._id" @removeUser="$emit('removeUser', $event)" />
    </section>
    <section v-else class="user-list">Yay! No user!</section>
    `,
    created(){
        console.log(this.users)
    },
  methods: {},
  components: {
    userPreview,
  },
}