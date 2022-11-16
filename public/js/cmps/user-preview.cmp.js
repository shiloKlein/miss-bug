'use strict'

export default {
  props: ['user'],
  template: `<article class="user-preview">
                <h4>{{user.username}}</h4>
                <span>{{user.fullname}}</span>
                <div class="actions">

                </div>
                <button @click="onRemove(user._id)">X</button>
              </article>`,
  methods: {
    onRemove(userId) {
      this.$emit('removeuser', userId)
    },
  },
}