<template>
  <div class="container h-100 w-100">
    <table-lite
      :is-slot-mode="true"
      :is-loading="table.isLoading"
      :columns="table.columns"
      :rows="table.rows"
      :total="table.totalRecordCount"
      :sortable="table.sortable"
      @do-search="doSearch"
      @is-finished="tableLoadingFinish"
    >
    <template v-slot:id="data">
      {{ data.value.id }}
    </template>

    <template v-slot:name="data">
      {{ data.value.name }}
    </template>

    <template v-slot:users="data">
      {{ extractUsers(data.value.users)}}
    </template>

    <template v-slot:participants="data">
      {{ extractParticipants(data.value.participants)}}
    </template>

    <template v-slot:devices="data">
      {{ extractDevices(data.value.devices)}}
    </template>

    <template v-slot:start_time="data">
      {{ data.value.start_time }}
    </template>

   <template v-slot:duration="data">
      {{ data.value.duration }}
    </template>

    <template v-slot:status="data">
      {{ data.value.status }}
    </template>

    </table-lite>
  <!--
  <Session v-for="(session, index) in allSessions " :key=index :data=session />
  -->
  </div>
</template>

<script>
// @ is an alias to /src
// import Session from '@/components/Session.vue'

import TableLite from 'vue3-table-lite'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('api')
// import { mapGetters } from 'vuex'

export default {
  name: 'SessionList',
  components: { TableLite },
  data () {
    return {
      table: {
        is_loading: false,
        columns: [
          {
            label: 'ID',
            field: 'id',
            width: '3%',
            sortable: true,
            isKey: true
          },
          {
            label: 'Session Name',
            field: 'name',
            width: '10%',
            sortable: false
          },
          {
            label: 'Device(s)',
            field: 'devices',
            width: '15%',
            sortable: true
          },
          {
            label: 'User(s)',
            field: 'users',
            width: '15%',
            sortable: false
          },
          {
            label: 'Participant(s)',
            field: 'participants',
            width: '15%',
            sortable: false
          },
          {
            label: 'Start Time',
            field: 'start_time',
            width: '10%',
            sortable: false
          },
          {
            label: 'Duration min(s)',
            field: 'duration',
            width: '10%',
            sortable: false
          },
          {
            label: 'Status',
            field: 'status',
            width: '10%',
            sortable: false
          }
        ],
        rows: [],
        totalRecordCount: 0,
        sortable: {
          order: 'id',
          sort: 'desc'
        }
      }
    }
  },
  methods: {
    isLoggedIn () {
      return this.$store.state.auth.status.loggedIn
    },
    extractUsers (users) {
      const userList = []
      for (const user of users) {
        userList.push(user.user_name)
      }
      return userList.join(', ')
    },
    extractParticipants (participants) {
      const participantList = []
      for (const participant of participants) {
        participantList.push(participant.participant_name)
      }
      return participantList.join(', ')
    },
    extractDevices (devices) {
      const deviceList = []
      for (const device of devices) {
        deviceList.push(device.device_name)
      }
      return deviceList.join(', ')
    },
    doSearch (offset, limit, order, sort) {
      console.log('doSearch', offset, limit, order, sort)
      // Get the part of the data required
      const rows = this.allSessions.slice(Math.min(this.allSessions.length, offset),
        Math.min(this.allSessions.length, offset + limit))
      this.table.rows = []
      for (let i = 0; i < rows.length; i++) {
        this.table.rows.push({
          id: rows[i].id_session,
          name: rows[i].session_name,
          users: rows[i].session_users,
          participants: rows[i].session_participants,
          devices: rows[i].session_devices,
          start_time: rows[i].session_start_datetime,
          duration: rows[i].session_duration,
          status: rows[i].session_status
        })
      }
    },
    tableLoadingFinish (elements) {
      console.log('tableLoadingFinish', elements)
      this.table.isLoading = false
    }
  },
  created () {
    if (this.isLoggedIn()) {
      this.table.is_loading = true
      this.$store.dispatch('api/getSessions').then(response => {
        this.table.is_loading = false
        this.table.totalRecordCount = this.allSessions.length
        this.doSearch(0, 10, 'id', 'asc')
      })
    } else {
      this.$router.push('/login')
    }
  },
  computed: {
    loggedIn () {
      return this.isLoggedIn()
    },
    // mix the getters into computed with object spread operator
    ...mapGetters(['allSessions'])
  }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
