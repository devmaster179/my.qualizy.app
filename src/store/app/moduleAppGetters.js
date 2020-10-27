/* eslint-disable no-redeclare */
export default {
  reportSchedule: state=> {
    console.log(state.report_schedule)
    return state.report_schedule
  },
  getReportScheduleByID: (state) => (id) => {
    return state.report_schedule.find(item => item.reportID == id)
  },
  auth: state=> {
    return state.auth
  },
  ipInfo: state => {
    return state.ipInfo
  },
  editAnswerIndexes: state => {
    return state.editAnswerIndexes
  },
  editType: state => {
    return state.editType
  },
  editAction: state => {
    return state.editAction
  },
  editScore: state => {
    return state.editScore
  },

  //============publicTemplate=================
  publicTemplates: state => {
    return state.publicTemplates
  },
  //============TemplateLabels=================
  labels: state => {
    return state.labels
  },
  getLabelById: state => (id) => {
    return state.labels.find((item) => {
      return id == item.id
    })
  },
  //=============templateType===================

  templateTypes: state => {
    return state.templateTypes
  },

  getTemplateTypeById: state => (id) => {
    return state.templateTypes.find(item => {
      return item.id == id
    })
  },
  getTemplateTypeByContent: state => (content) => {
    return state.templateTypes.find(item => {
      return item.content == content
    })
  },

  typedTemplateType: state => {
    return state.typedTemplateType
  },

  //===========Template=========================
  template: state => {
    var templates = state.templates
    return templates
  },
  getTemplateById: state => (id) => {
    return state.templates.find((item) => {
      return item.id == id
    })
  },
  getBookedTemplate: state => {
    var templates = state.templates.filter((item) => {
      return item.content.templateSD == 'bookmarked' && !item.trashed
    })
    return templates.sort((a, b) => b.updated_at.toDate().getTime() - a.updated_at.toDate().getTime())
  },

  //==============User========================
  users: state => {
    return state.users
  },
  getUserById: state => (id) => {
    return state.users.find((item) => {
      return item.id == id
    })
  },
  getUsersByTeam: state=> (id) => {
    return state.users.filter((user=> user.team.indexOf(id)>-1 && user.status))
  },

  //==============Team========================
  teams: state => {
    return state.teams
  },
  getTeamById: state => (id) => {
    return state.teams.find((item) => {
      return item.id == id
    })
  },

  currentTeams: state => {
    return state.currentTeams
  },

  activeTeams: state => {
    return state.teams.filter(item => item.active)
  },

  //==============Location========================

  locations: state => {
    return state.locations

  },
  getLocationById: state => (id) => {
    return state.locations.find(location => {
      return location.id == id
    })
  },

  //=============Schedules======================

  schedules: state => {
    return state.schedules.filter(item => item.active)
  },
  getScheduleById: state => (id) => {
    return state.schedules.find((item) => {
      return item.id == id
    })
  },
  getSchedulesByTeam: state => (teams) => {
    if (teams == undefined) return []
    return state.schedules.filter(item => item.active && item.assign.some(team => teams.includes(team)))
  },
  getScheduleByTemplate: state => (template) => {
    return state.schedules.filter(item => item.active && item.template == template)
  },

  //=============Logs==========================

  logs: state => {
    return state.logs
  },
  getLogByTidTime: state => (id, time , sID , assign) => {
    return state.logs.find((item) => {
      return item.templateID == id && item.time !== undefined && item.time.toDate().getTime() == time.getTime() && item.schedule == sID 
    })
  },
  getLogById: state => (id) => {
    return state.logs.find((item) => {
      return item.id == id
    })
  },
  getIncompleteLogs: state => {
    return state.logs.filter((item) => {
      let complated = true
      if (item.key !== undefined && item.key == 'pinned') {
        item.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              if (answer.ref.mandatory && !answer.loged)
                complated = false
            })
          })
        })
      }
      return !complated
    })
  },
  getLogFiltersAll: state => {
    return state.logFilters
  },

  filteredLogs: state => {
    var logs = state.logs
    logs = logs.filter(log => {
      var template = state.templates.find((template) => {
        return log.templateID == template.id
      })
      if (template == undefined) return false
      if (template.trashed === undefined) return true
      return !template.trashed
    })
    state.logFilters.map((item) => {
      if (item.value != "") {
        logs = logs.filter((log) => {
          if (item.key == 'from')
            return log.updated_at.toDate().getTime() >= item.value.getTime()
          else if (item.key == 'to')
            return log.updated_at.toDate().getTime() <= item.value.getTime()
          else if (item.key == 'template') {
            var ids = []
            item.value.map(val => {
              ids.push(val.id)
            })
            ids = ids.join()
            return ids.search(log.templateID) > -1
          } else if (item.key == 'users') {
            var users = []
            item.value.map(val => {
              users.push(val.id)
            })
            var userFlag = false
            log.logs.map(__log => {
              if (userFlag) return
              __log.questions.map(question => {
                if (userFlag) return
                question.answers.map(answer => {
                  if (userFlag) return
                  if (!answer.loged) return
                  if (users.indexOf(answer.user) > -1)
                    userFlag = true
                })
              })
            })
            return userFlag
          } else if (item.key == 'teams') {
            var teams = []
            item.value.map(val => {
              teams.push(val.id)
            })
            var teamFlag = false
            log.logs.map(__log => {
              if (teamFlag) return
              __log.questions.map(question => {
                if (teamFlag) return
                question.answers.map(answer => {
                  if (teamFlag) return
                  if (!answer.loged) return
                  var team = state.users.find(item => item.id == answer.user)
                  if (team === undefined || team.team === undefined) return
                  team = team.team
                  teamFlag = teams.some(item => team.includes(item))
                })
              })
            })
            return teamFlag
          } else if (item.key == 'label') {
            var ids = []
            item.value.map(val => {
              ids.push(val.id)
            })
            ids = ids.join()
            var template = state.templates.find((template) => {
              return log.templateID == template.id
            })
            var labels = template.content.templateLabel
            for (let i = 0; i < labels.length; i++) {
              if (ids.search(labels[i]) !== -1)
                return true
            }
          } else if (item.key == 'status') {
            var falied = false
            log.logs.map(page => {
              page.questions.map(question => {
                question.answers.map(answer => {
                  if (answer.ref.type.failedAnswer && answer.ref.type.failedAnswer == answer.value)
                    falied = true
                })
              })
            })
            if (item.value == 'Passed' && !falied)
              return true
            else if (item.value != 'Passed' && falied)
              return true
          }
        })
      }
    })
    return logs.sort((a, b) => b.updated_at.toDate().getTime() - a.updated_at.toDate().getTime())
  },
  getLogFilters: state => {
    return state.logFilters.filter(filter => {
      return filter.value != ""
    })
  },


  //=============Items=========================

  items: state => {
    return state.items
  },
  getItemById: state => (id) => {
    return state.items.find((item) => {
      return item.id == id
    })
  },

  //=============Documents=========================

  documents: state => {
    return state.documents
  },

  getDocumentById: state => (id) => {
    return state.documents.find((item) => item.id == id)
  },

  //=============Allergens=========================

  allergens: state => {
    return state.allergens
  },
  getAllergenById: state => (id) => {
    return state.allergens.find(item => item.id == id)
  },

  //================Chats============================

  chats: state => {
    return state.chats
  },
  getChatById: state => (id) => {
    return state.chats.find(item => item.id == id)
  },
  chatUnseenMessages: state => (from, to) => {
    return state.chats.filter(item => item.from == from && item.to == to && !item.isSeen)
  },

  getChatFileUpload: state => {
    return state.chatFileUploading
  },

  //=================Current User ====================

  currentUser: state => {
    return state.currentUser
  },

  //================Knowledge==========================

  knowledge: state => {
    return state.knowledge
  },
  knowledge_category: state => {
    return state.knowledge.filter(item => item.type == 'category')
  },
  knowledge_article: state => {
    return state.knowledge.filter(item => item.type == 'article')
  },
  getKnowledgeById: state => (id) => {
    return state.knowledge.find(item => item.id == id)
  },
  getArticleByCategory: state => (id) => {
    return state.knowledge.filter(item => item.category == id && item.type == 'article')
  },

  //================Notifications==========================

  notifications: state => {
    return state.notifications
    // return state.notifications.sort((a,b) => a.at.toDate().getTime() - b.at.toDate().getTime())
  },

  getNotificationByT_Indexes: state => (infors) => {
    return state.notifications.find(item => item.templateId == infors.tId && item.templateIndexes[0] == infors.indexes[0] && item.templateIndexes[1] == infors.indexes[1] && item.templateIndexes[2] == infors.indexes[2] && item.logID == infors.logID)
  },
  unreadNotifications: state => user => {
    // var notifications = state.notifications.filter(item => item.at != undefined && item.readIds.indexOf(user.id) < 0 && item.toTeam.some(team => user.team.includes(team)))
    var notifications = state.notifications.filter(item => item.readIds.indexOf(user.id) < 0 && item.toTeam.some(team => user.team.includes(team)))
    return notifications.sort((a, b) => b.updated_at.toDate().getTime() - a.updated_at.toDate().getTime())
  },
  getNotificationById: state => (id) => {
    return state.notifications.find(item => item.id == id)
  },

  //================IOT==========================

  iots: state => {
    return state.iots
  },
  getIotById: state => (id) => {
    return state.iots.find(item => item.id == id)
  },
  getIotByTid: state => (param) => {
    return state.iots.find(item => item.templateID == param.tID && item.page == param.indexes[0] && item.question == param.indexes[1] && item.answer == param.indexes[2])
  },
  getIotByMac: state => (mac) => {
    return state.iots.find(item => item.macAddress == mac)
  },

  //====================Location Lists=================================
  locationList: state => {
    return state.locationList
  },

  //====================Reports=================================
  reports: state => {
    return state.reports
  },
  reportByID: state => id => {
    return state.reports.find(item => item.id = id)
  },

  //====================suppliers=================================
  suppliers: state => {
    return state.suppliers
  },
  getSupplierByID: state => id => {
    return state.suppliers.find(item => item.id == id)
  },

  getTempTemplate: state => {
    return state.tempTemplate
  },

  getTempTemplate1: state => {
    return state.tempTemplate1
  },

  tempClosedAnswer: state => {
    return state.tempClosedAnswer
  }
}