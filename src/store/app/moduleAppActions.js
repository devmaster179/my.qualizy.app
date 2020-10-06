export default {
  setLabel({
    commit
  }, query) {
    commit('SET_LABEL', query)
  },
  setTemplateType({
    commit
  }, query) {
    commit('SET_TEMPLATE_TYPE', query)
  },
  setTemplate({
    commit
  }, query) {
    commit('SET_TEMPLATE', query)
  },
  setUsers({
    commit
  }, query) {
    commit('SET_USERS', query)
  },
  setTeams({
    commit
  }, query) {
    commit('SET_TEAMS', query)
  },
  setSchedules({
    commit
  }, query) {
    commit('SET_SCHEDULES', query)
  },
  setCurrentTeams({
    commit
  }, query) {
    commit('SET_CURRENTTEAMS', query)
  },
  setLogs({
    commit
  }, query) {
    commit('SET_LOGS', query)
  },

  setItems({
    commit
  }, query) {
    commit('SET_ITEMS', query)
  },
  updateLogFilter({
    commit
  }, query) {
    commit('UPDATE_LOG_FILTER', query)
  },
  setLogFilter({
    commit
  }) {
    commit('SET_LOG_FILTER')
  },
  setLocations({
    commit
  }, query) {
    commit('SET_LOCATIONS', query)
  },
  setDocument({
    commit
  }, query) {
    commit('SET_DOCUMENTS', query)
  },
  setAllergens({
    commit
  }, query) {
    commit('SET_ALLERGENS', query)
  },

  setChats({
    commit
  }, query) {
    commit('SET_CHATS', query)
  },
  setCurrentUsesr({
    commit
  }, query) {
    commit('SET_CURRENT_USER', query)
  },

  setKnowledge({
    commit
  }, query) {
    commit('SET_KNOWLEDGE', query)
  },
  setNotifications({
    commit
  }, query) {
    commit('SET_NOTIFICATIONS', query)
  },
  setIots({
    commit
  }, query) {
    commit('SET_IOTS', query)
  },

  addLocationList({
    commit
  }, query) {
    commit('ADD_LOCATION_LIST', query)
  },
  removeLocationList({
    commit
  }, query) {
    commit('REMOVE_LOCATION_LIST', query)
  },
  setPublicTemplates({
    commit
  }, query) {
    commit('SET_PUBLIC_TEMPLATES', query)
  },

  chatFileUploding({
    commit
  }, query) {
    commit('SET_CHAT_FILE_UPLOADING', query)

  },
  setFileProgress({
    commit
  }, query) {
    commit('SET_CHAT_FILE_UPLOADING_PROGRESS', query)
  },
  initFileUpload({
    commit
  }) {
    commit('INIT_FILE_UPLOAD')
  },

  setReports({
    commit
  }, query) {
    commit("SET_REPORTS", query)
  },

  setSuppliers({ commit }, query) {
    commit('SET_SUPPLIERS', query)
  },

  chnTemplateImage({ commit }, query) {
    commit('CHN_TEMPLATE_IMAGE', query)
  },
  chnTemplateLocation({ commit }, query) {
    commit("CHN_TEMPLATE_LOCATION", query)
  },
  chnTemplateTag({ commit }, query) {
    commit("CHN_TEMPLATE_TAG", query)
  },
  addTag({ commit }, query) {
    commit("ADD_TAG", query)
  },
  chnTemplateSD({ commit }, query) {
    commit("CHN_TEMPLATE_SD", query)
  },
  setTypedTemplateType({ commit }, query) {
    commit("SET_TYPED_TEMPLATE_TYPE", query)
  },
  chnTempClosedAnswer({ commit }, query) {
    commit("CHN_TEMP_CLOSED_ANSWER", query)

  }

}