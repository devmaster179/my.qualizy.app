
<template>
  <vs-sidebar
    click-not-close
    :parent="parent"
    :hidden-background="true"
    class="log-sidebar items-no-padding"
    v-model="sidebarActive"
    position-right
  >
    <div class="md:flex items-center hidden">
      <span
        class="karla-bold main-pagetitle cursor-pointer"
        @click="sidebarActive = false"
        >{{
          $t(parent.split("#")[1].replace("-", " ")) | capitalize
        }}&nbsp;</span
      >
      <span class="karla-bold page-title ml-2"
        >>&nbsp;{{ $t("task details") }}</span
      >
    </div>
    <div
      class="log-container mx-auto px-1 sm:px-0"
      v-if="logID != '' && pages.length > 0"
    >
      <VuePerfectScrollbar
        @ps-scroll-y="scrollHandle"
        :settings="settings"
        ref="pageLists"
        class="scroll-area-task pr-1 sm:mt-3 mt-1"
      >
        <vx-card>
          <div slot="no-body" class="px-4 py-2 sm:py-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <vs-icon
                  icon-pack="feather"
                  icon="icon-arrow-left"
                  size="20px"
                  class="cursor-pointer block md:hidden"
                  @click="sidebarActive = false"
                />
                <img
                  :src="applyImage(templateInfo.content.templateImage)"
                  width="37"
                  height="37"
                  class="rounded-full"
                />
              </div>
              <p class="karla-bold template-title ml-2">
                {{ templateInfo.content.templateTitle | capitalize }}
              </p>
              <p class="karla-bold template-title">{{ calcComplateStatus }}</p>
            </div>
          </div>
        </vx-card>
        <vx-card
          class="mt-2 sm:mt-base cursor-pointer"
          @click.native="viewPage = !viewPage"
        >
          <div slot="no-body" class="px-4 py-3">
            <div class="flex justify-between items-center">
              <div>
                <p class="karla-bold" style="color: #1e1c26">
                  {{ pages[pageNum].title | capitalize }}
                </p>
                <p class="karla page-infor">
                  {{ $t("page") | capitalize }} {{ pageNum + 1 }}
                  {{ $t("of") }} {{ pages.length }}
                </p>
              </div>
              <div class="flex items-center">
                <p class="karla-bold mr-2" style="color: #1e1c26">
                  {{ calcPageCompletd }}
                </p>
                <vs-icon
                  class="font-bold expand-icon"
                  :class="{ on: viewPage, off: !viewPage }"
                  icon-pack="feather"
                  icon="icon-chevron-up"
                ></vs-icon>
              </div>
            </div>
          </div>
        </vx-card>
        <vx-card class="mt-2 pages-container" v-show="viewPage">
          <div slot="no-body">
            <div
              v-for="(page, index) in pages"
              :key="index"
              class="cursor-pointer p-5 page-item"
              :class="{ active: pageNum == index }"
              @click="pageNum = index"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <vs-icon
                    icon-pack="feather"
                    size="18px"
                    class="font-bold"
                    color="primary"
                    icon="icon-check"
                    v-if="index == pageNum"
                  />
                  <p
                    class="karla-bold truncate"
                    :class="{
                      'ml-4': index == pageNum,
                      'ml-8': index != pageNum,
                    }"
                  >
                    {{
                      page.title == ""
                        ? $t("Page Title")
                        : page.title | capitalize
                    }}
                  </p>
                </div>
                <p class="karla-bold mr-2" style="color: #1e1c26">
                  {{ calcPageCompletd1(index) }}
                </p>
              </div>
            </div>
          </div>
        </vx-card>
        <transition
          v-for="(page, pIndex) in pages"
          :key="pIndex"
          name="custom-classes-transition"
          :enter-active-class="enterClass"
        >
          <div class="w-full mt-2 sm:mt-base" v-if="pageNum == pIndex">
            <vx-card
              v-for="(question, qIndex) in page.questions"
              :key="qIndex"
              class="mb-4"
            >
              <div slot="no-body" class="px-5 py-4">
                <div class="vx-row items-center mb-2">
                  <div class="vx-col w-5/6 p-0">
                    <p class="karla-bold text-primary">
                      {{ question.title | capitalize }}
                    </p>
                  </div>
                  <div class="vx-col w-1/6 p-0">
                    <p class="karla-bold text-right" style="color: #1e1c26">
                      {{ calcQuestionCompletd(pIndex, qIndex) }}
                    </p>
                  </div>
                </div>
                <vs-divider position="left" class="m-0 mt-3 mb-2"></vs-divider>

                <div
                  v-for="(answer, aIndex) in question.answers"
                  :key="aIndex"
                  class="mt-5"
                >
                  <div class="answer-title karla-bold">
                    {{ answer.ref.title | capitalize }}
                    <span v-if="answer.ref.mandatory" class="text-danger"
                      >*</span
                    >
                    <span
                      class="text-primary"
                      v-if="
                        getTemplateType(answer.ref.type.id).content ==
                        'temperature'
                      "
                      >({{ answer.ref.type.tempUnit }})</span
                    >
                  </div>
                  <div class="vx-row answer-content">
                    <template
                      v-if="
                        getTemplateType(answer.ref.type.id).type ==
                        'closed answers'
                      "
                    >
                      <div
                        :class="
                          closeAnswerWidth(
                            getTemplateType(answer.ref.type.id).content.length
                          )
                        "
                        class="pl-4 sm:mt-0 mt-1 w-full"
                        v-for="(content, cIndex) in getTemplateType(
                          answer.ref.type.id
                        ).content"
                        :key="'c' + cIndex"
                      >
                        <div
                          v-if="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value == content.name
                          "
                          class="flex items-center justify-center border border-solid rounded-lg py-3 cursor-pointer"
                          :style="`background:${hexToRGB(
                            content.color
                          )}; border-color:${hexToRGB(content.color)};`"
                        >
                          <span
                            class="karla text-white"
                            v-if="
                              getTemplateType(answer.ref.type.id).group ==
                              'global'
                            "
                            >{{ $t(content.name) }}</span
                          >
                          <span class="karla text-white" v-else>{{
                            content.name | capitalize
                          }}</span>
                        </div>
                        <div
                          v-else
                          class="flex items-center justify-center border border-solid rounded-lg py-3 cursor-pointer"
                          @click="
                            chnContent(
                              pIndex,
                              qIndex,
                              aIndex,
                              content.name,
                              answer.ref.type.failedAnswer,
                              templateAction(pIndex, qIndex, aIndex)
                            )
                          "
                        >
                          <span
                            class="karla"
                            v-if="
                              getTemplateType(answer.ref.type.id).group ==
                              'global'
                            "
                            >{{ $t(content.name) }}</span
                          >
                          <span class="karla" v-else>{{
                            content.name | capitalize
                          }}</span>
                        </div>
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content == 'number'
                      "
                    >
                      <div
                        class="pl-4 w-full flex items-center justify-between"
                      >
                        <vs-input
                          type="number"
                          class="w-full mr-2"
                          :value="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          v-on:input="chnValue($event, pIndex, qIndex, aIndex)"
                        />
                        <div class="flex items-center">
                          <span
                            @click="
                              chnValue(
                                pages[pIndex].questions[qIndex].answers[aIndex]
                                  .value + 1,
                                pIndex,
                                qIndex,
                                aIndex
                              )
                            "
                            style="
                              font-size: 25px;
                              border: 1px solid rgba(0, 0, 0, 0.2);
                              width: 48px;
                              height: 48px;
                            "
                            class="rounded-lg px-3 text-center cursor-pointer numBtn mr-2 pt-1 block"
                            >+</span
                          >
                          <span
                            @click="
                              chnValue(
                                pages[pIndex].questions[qIndex].answers[aIndex]
                                  .value - 1,
                                pIndex,
                                qIndex,
                                aIndex
                              )
                            "
                            style="
                              font-size: 25px;
                              border: 1px solid rgba(0, 0, 0, 0.2);
                              width: 48px;
                              height: 48px;
                            "
                            class="rounded-lg px-3 text-center cursor-pointer numBtn block pt-1"
                            >-</span
                          >
                        </div>
                        <!-- <vs-button color="white" type="border">
                        <span class="karla text-black">+</span>
                        </vs-button>-->
                        <!-- <vs-input-number
                        color="success"
                        :value="pages[pIndex].questions[qIndex].answers[aIndex].value"
                        v-on:input="chnValue($event,pIndex,qIndex,aIndex)"
                        />-->
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content ==
                        'signature'
                      "
                    >
                      <div class="pl-4 w-full">
                        <div
                          v-if="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value.url != undefined &&
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value.url != ''
                          "
                        >
                          <img
                            class="w-full border border-solid d-theme-border-grey-light"
                            :src="
                              pages[pIndex].questions[qIndex].answers[aIndex]
                                .value.url
                            "
                            height="150px"
                          />
                          <div class="flex justify-end mt-4">
                            <vs-button
                              color="danger"
                              @click="
                                pages[pIndex].questions[qIndex].answers[
                                  aIndex
                                ].value.url = ''
                              "
                              >{{ $t("clear") }}</vs-button
                            >
                          </div>
                        </div>
                        <div v-else>
                          <VueSignaturePad
                            height="150px"
                            width="300px"
                            :ref="
                              'signaturePad_' +
                              pIndex +
                              '_' +
                              qIndex +
                              '_' +
                              aIndex
                            "
                            class="border border-solid d-theme-border-grey-light"
                            :class="{ 'w-full': !(isMobile || isIOS) }"
                            :options="{ onBegin, onEnd, penColor: '#2128ff' }"
                            :images="signImage(pIndex, qIndex, aIndex)"
                          />
                          <div class="sm:flex justify-between w-full mt-4">
                            <vs-button
                              class="w-full mb-2"
                              color="danger"
                              @click="clearSign(pIndex, qIndex, aIndex)"
                              >{{ $t("clear") }}</vs-button
                            >
                            <vs-button
                              class="w-full mx-0 sm:mx-5 mb-2"
                              color="warning"
                              @click="undoSign(pIndex, qIndex, aIndex)"
                              >{{ $t("undo") }}</vs-button
                            >
                            <vs-button
                              class="w-full mb-2"
                              color="primary"
                              @click="saveSign(pIndex, qIndex, aIndex)"
                              >{{ $t("save") }}</vs-button
                            >
                          </div>
                        </div>
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content ==
                        'instruction'
                      "
                    >
                      <div class="pl-4 w-full">
                        <div
                          style="
                            white-space: pre-wrap;
                            font-size: 12px;
                            color: #86848a;
                          "
                          v-html="answer.ref.type.instruction"
                        ></div>
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content ==
                        'checkbox'
                      "
                    >
                      <div class="pl-4 w-full">
                        <vs-checkbox
                          color="success"
                          :value="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          v-on:input="chnValue($event, pIndex, qIndex, aIndex)"
                        ></vs-checkbox>
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content ==
                          'paragraph' ||
                        getTemplateType(answer.ref.type.id).content ==
                          'short answer'
                      "
                    >
                      <div class="pl-4 w-full">
                        <textarea
                          class="my-textarea"
                          :value="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          @blur="
                            chnValue(
                              $event.target.value,
                              pIndex,
                              qIndex,
                              aIndex
                            )
                          "
                        />
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content ==
                        'temperature'
                      "
                    >
                      <div class="pl-4 w-full flex justify-between">
                        <vs-input
                          type="number"
                          class="w-full mr-1"
                          :value="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          @blur="
                            chnValue(
                              $event,
                              pIndex,
                              qIndex,
                              aIndex,
                              'temperature',
                              templateAction(pIndex, qIndex, aIndex)
                            )
                          "
                        />
                        <span
                          style="
                            font-size: 20px;
                            border: 1px solid rgba(0, 0, 0, 0.2);
                            width: 48px;
                          "
                          class="rounded-lg px-1 pt-2 text-center cursor-pointer numBtn"
                          @click="
                            chnValue(
                              pages[pIndex].questions[qIndex].answers[aIndex]
                                .value * -1,
                              pIndex,
                              qIndex,
                              aIndex,
                              '',
                              templateAction(pIndex, qIndex, aIndex)
                            )
                          "
                          >&plus;&#8725;&minus;</span
                        >
                      </div>
                    </template>

                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content == 'star'
                      "
                    >
                      <div class="pl-4 w-full">
                        <star-rating
                          :show-rating="false"
                          :star-size="40"
                          text-class="text-warning font-medium"
                          :rating="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          @rating-selected="
                            chnValue($event, pIndex, qIndex, aIndex)
                          "
                          :glow="5"
                          :increment="0.5"
                          :fixed-points="1"
                        ></star-rating>
                      </div>
                    </template>

                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content == 'score'
                      "
                    >
                      <div class="pl-4 w-full">
                        <score-item
                          :p="pIndex"
                          :q="qIndex"
                          :a="aIndex"
                          :score="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          @input="chnValue"
                        />
                      </div>
                    </template>

                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content ==
                        'automatic date and time stamp'
                      "
                    >
                      <div class="pl-4 w-full flex items-center justify-between">
                        <span
                          class
                          style="
                            font-style: italic;
                            color: #1e1c26;
                            opacity: 0.54;
                            font-size: 12px;
                          "
                          >{{
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value.nanoseconds !== undefined
                              ? pages[pIndex].questions[qIndex].answers[
                                  aIndex
                                ].value.toDate()
                              : pages[pIndex].questions[qIndex].answers[aIndex]
                                  .value
                                | moment("dddd, MMMM Do YYYY - H:mm:ss")
                          }}</span
                        >
                        <!-- <vs-button
                          class="px-1 sm:px-4 text-right align-end"
                          color="primary"
                          v-if="aIndex === question.answers.length-1"
                          type="filled"
                          @click="duplicateSection(pIndex, qIndex, aIndex)"
                          >{{ $t("duplicate") | capitalize }}</vs-button
                        > -->
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content == 'items'
                      "
                    >
                      <div class="pl-4 w-full">
                        <food-item
                          :selectedItem="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          :p="pIndex"
                          :q="qIndex"
                          :a="aIndex"
                          @chnItem="chnItem"
                        />

                        <!-- <v-select
                        :value="getFooditem(pages[pIndex].questions[qIndex].answers[aIndex].value)"
                        @input="chnItem($event,pIndex,qIndex,aIndex,true)"
                        :options="foodItems"
                        label="name"
                        ></v-select>-->
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content == 'users'
                      "
                    >
                      <div class="pl-4 w-full">
                        <v-select
                          :filterable="false"
                          @search="searchUserList"
                          :placeholder="$t('please type 3 letters at least')"
                          :value="
                            getUser(
                              pages[pIndex].questions[qIndex].answers[aIndex]
                                .value
                            )
                          "
                          @input="chnItem($event, pIndex, qIndex, aIndex, true)"
                          :options="userList"
                          label="name"
                        ></v-select>
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content == 'teams'
                      "
                    >
                      <div class="pl-4 w-full">
                        <v-select
                          :value="
                            getTeam(
                              pages[pIndex].questions[qIndex].answers[aIndex]
                                .value
                            )
                          "
                          @input="chnItem($event, pIndex, qIndex, aIndex, true)"
                          :options="teamList"
                          label="name"
                        ></v-select>
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content ==
                        'drop down'
                      "
                    >
                      <div class="pl-4 w-full">
                        <v-select
                          :value="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          @input="
                            chnItem($event, pIndex, qIndex, aIndex, true, true)
                          "
                          :options="
                            pages[pIndex].questions[qIndex].answers[aIndex].ref
                              .type.dropdown
                              ? pages[pIndex].questions[qIndex].answers[
                                  aIndex
                                ].ref.type.dropdown.split(',')
                              : []
                          "
                        ></v-select>
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content == 'date'
                      "
                    >
                      <div
                        class="pl-4 w-full relative"
                        :class="{ hasClockIcon: !(isMobile || isIOS) }"
                      >
                        <flat-pickr
                          class="flatpickr-input w-full"
                          :config="configDatePicker"
                          :value="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          @input="chnValue($event, pIndex, qIndex, aIndex)"
                        />
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content ==
                        'date time'
                      "
                    >
                      <div
                        class="pl-4 w-full relative"
                        :class="{ hasClockIcon: !(isMobile || isIOS) }"
                      >
                        <flat-pickr
                          v-if="
                            answer.ref.type.dateType == 'Date' ||
                            answer.ref.type.dateType == undefined
                          "
                          class="flatpickr-input w-full"
                          :config="configDatePicker"
                          :value="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          @input="chnValue($event, pIndex, qIndex, aIndex)"
                        />
                        <flat-pickr
                          v-else-if="answer.ref.type.dateType == 'Time'"
                          class="flatpickr-input w-full"
                          :config="configTimePicker"
                          :value="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          @input="chnValue($event, pIndex, qIndex, aIndex)"
                        />
                        <flat-pickr
                          v-else-if="answer.ref.type.dateType == 'Date & Time'"
                          class="flatpickr-input w-full"
                          :config="configDateTimePicker"
                          :value="
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .value
                          "
                          @input="chnValue($event, pIndex, qIndex, aIndex)"
                        />
                      </div>
                    </template>
                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content ==
                        'automatic user stamp'
                      "
                    >
                      <div class="pl-4 w-full">
                        <span
                          style="
                            font-style: italic;
                            color: #1e1c26;
                            opacity: 0.54;
                            font-size: 12px;
                          "
                          >{{
                            currentUser(
                              pages[pIndex].questions[qIndex].answers[aIndex]
                                .value
                            ) | capitalize
                          }}</span
                        >
                      </div>
                    </template>

                    <template
                      v-else-if="
                        getTemplateType(answer.ref.type.id).content ==
                          'photo' ||
                        getTemplateType(answer.ref.type.id).content ==
                          'receipts'
                      "
                    >
                      <div class="sm:pl-4 pl-0 w-full">
                        <div class="con-upload">
                          <view-upload
                            v-if="viewActive"
                            :src="viewSrc"
                            @closeImage="closeImage"
                          />
                          <div class="con-img-upload py-0 m-0">
                            <div
                              class="img-upload my-2"
                              v-for="(image, imageKey) in pages[pIndex]
                                .questions[qIndex].answers[aIndex].images"
                              :key="imageKey"
                            >
                              <button
                                type="button"
                                class="btn-x-file"
                                @click="
                                  removeImage(image.url, pIndex, qIndex, aIndex)
                                "
                              >
                                <i
                                  translate="translate"
                                  class="material-icons notranslate"
                                  >delete</i
                                >
                              </button>
                              <img
                                :src="image.url"
                                style="max-width: none; max-height: 100%"
                                @touchend="viewImage(image.url, $event)"
                                @click="viewImage(image.url, $event)"
                              />
                            </div>
                            <file-upload
                              :indexs="[pIndex, qIndex, aIndex]"
                              @url="uploadSucess"
                            />
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div
                  class="mt-5">
                  <div class="vx-row answer-content">
                    <template>
                      <div class="pl-4 w-full flex items-center justify-between">
                        <span></span>
                        <vs-button
                          class="px-1 sm:px-4 text-right align-end"
                          color="primary"
                          type="filled"
                          @click="duplicateSection(pIndex, qIndex)"
                          >{{ $t("duplicate") | capitalize }}</vs-button
                        >
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </vx-card>
          </div>
        </transition>
      </VuePerfectScrollbar>
    </div>
    <vx-card class="mx-auto mt-4" style="max-width: 645px">
      <div slot="no-body" class="px-4 py-3">
        <div class="flex items-center justify-between">
          <div>
            <vs-button
              v-if="pages.length > 1"
              type="filled"
              @click.native="minusPage"
              :disabled="pageNum == 0"
              style="background: rgba(var(--vs-primary), 0.1) !important"
            >
              <span class="karla text-primary">{{
                $t("prev") | capitalize
              }}</span>
            </vs-button>
          </div>
          <div>
            <vs-button
              v-if="pageNum < pages.length - 1"
              type="filled"
              @click.native="plusPage"
              :disabled="pageNum == pages.length - 1"
            >
              <span class="karla text-white">{{
                $t("next") | capitalize
              }}</span>
            </vs-button>
            <vs-button
              class="px-1 sm:px-4 text-right"
              color="success"
              icon-pack="feather"
              icon="icon-check-circle"
              v-if="pageNum >= pages.length - 1"
              type="filled"
              @click="sidebarActive = false"
              >{{ $t("complete") | capitalize }}</vs-button
            >
          </div>
        </div>
      </div>
    </vx-card>
  </vs-sidebar>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Datepicker from "vuejs-datepicker";
import StarRating from "vue-star-rating";
import VSelect from "vue-select";
import FileUpload from "@/components/file-upload/FileUpload.vue";
import ViewUpload from "@/components/file-upload/ViewUpload.vue";
import ScoreItem from "./ScoreItem";
import FoodItem from "./FoodItem";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { storage } from "@/firebase/firebaseStorage";

import firebase, { analytics } from "firebase/app";
import "@firebase/firestore";
import { isMobile, isIOS } from "mobile-device-detect";
export default {
  props: {
    parent: {
      type: String,
      default: "",
    },
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
    template: {
      type: String,
      required: true,
    },
    pages: {
      type: Array,
      required: true,
    },

    logID: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      signatureTop: -1,
      scrollUpdate: false,
      userList: [],
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.5,
        suppressScrollY: false,
      },
      viewPage: false,
      windowWidth: window.innerWidth,
      tempNumber: 0,
      configDateTimePicker: {
        enableTime: true,
        altFormat: "Y/m/d H:i",
        altInput: true,
        dateFormat: "Z",
      },
      configTimePicker: {
        enableTime: true,
        noCalendar: true,
        dateFormat: "Z",
        altFormat: "H:i",
        altInput: true,
      },
      configDatePicker: {
        dateFormat: "Z",
        altFormat: "Y/m/d",
        altInput: true,
      },
      lastTap: new Date().getTime(),
      complated: 0,
      viewSrc: "",
      viewActive: false,
      initState: true,
      saveState: false,
      now: new Date(),
      showThread: false,
      enterClass: "animated bounceInRight",
      pageNum: 0,
      log: [],
      number: 0,
    };
  },
  watch: {
    initState(val) {
      if (!val) {
        setTimeout(() => {
          this.initState = true;
        }, 2000);
      }
    },
    saveState(val) {
      if (val) {
        setTimeout(() => {
          this.saveState = false;
        }, 1000);
      }
    },
    pageNum() {
      this.viewPage = false;
      this.$refs.pageLists.$el.scrollTop = 0;
    },
    isSidebarActive(value) {
      if (value) {
        this.pageNum = 0;
        this.viewPage = false;
      }

      // if (!value) {
      //   setTimeout(() => {
      //     this.showThread = false;
      //   }, 500);
    },
  },

  computed: {
    templateAction() {
      return (p, q, a) => {
        return false;
        return this.templateInfo.content.pages[p].questions[q].answers[a]
          .action;
      };
    },
    isMobile() {
      return isMobile;
    },
    isIOS() {
      return isIOS;
    },
    signImage() {
      return (p, q, a) => {
        if (this.pages[p].questions[q].answers[a].value.url !== undefined)
          return [
            {
              src: this.pages[p].questions[q].answers[a].value.url,
              x: 0,
              y: 0,
            },
          ];
        return [];
      };
    },
    sidebarActive: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        this.$emit("closeSidebar");
      },
    },
    templateInfo() {
      return this.$store.getters["app/getTemplateById"](this.template);
    },
    getUser() {
      return (id) => {
        if (id === undefined || id == "") return null;
        else {
          let user = this.$store.getters["app/getUserById"](id);
          if (Object.keys(user).length > 0)
            return { id: user.id, name: user.name };
          else return null;
        }
      };
    },
    getTeam() {
      return (id) => {
        if (id === undefined || id == "") return null;
        else {
          let team = this.$store.getters["app/getTeamById"](id);
          if (Object.keys(team).length > 0)
            return { id: team.id, name: team.name };
          else return null;
        }
      };
    },
    // userList() {
    //   var __users = [];
    //   let users = this.$store.getters["app/users"].filter(
    //     (item) => !item.deleted && item.status
    //   );
    //   users.map((item) => {
    //     __users.push({ id: item.id, name: item.name });
    //   });
    //   return __users;
    // },
    teamList() {
      var __teams = [];
      let teams = this.$store.getters["app/teams"].filter(
        (item) => !item.deleted && item.active
      );
      teams.map((item) => {
        __teams.push({ id: item.id, name: item.name });
      });
      return __teams;
    },
    calcPageCompletd1() {
      return (number) => {
        var count = 0;
        var complated = 0;
        this.pages[number].questions.map((question) => {
          question.answers.map((answer) => {
            if (answer.ref.mandatory) {
              complated++;
              if (answer.loged) count++;
            }
          });
        });
        return count + "/" + complated;
      };
    },
    calcPageCompletd() {
      var count = 0;
      var complated = 0;
      this.pages[this.pageNum].questions.map((question) => {
        question.answers.map((answer) => {
          if (answer.ref.mandatory) {
            complated++;
            if (answer.loged) count++;
          }
        });
      });
      return count + "/" + complated;
    },
    calcQuestionCompletd() {
      return (p, q) => {
        var count = 0;
        var _complated = 0;
        this.pages[p].questions[q].answers.map((answer, a) => {
          if (answer.ref.mandatory) {
            if (answer.loged) {
              _complated++;
            }
            count++;
          }
        });
        return _complated + "/" + count;
      };
    },
    calcColor() {
      return () => {
        if (this.complated < 30) return "danger";
        else if (this.complated < 80) return "warning";
        else return "success";
      };
    },
    calcComplateStatus() {
      var count = 0;
      var _complated = 0;
      this.pages.map((page, p) => {
        page.questions.map((question, q) => {
          question.answers.map((answer, a) => {
            if (answer.ref.mandatory) {
              if (this.pages[p].questions[q].answers[a].loged) {
                // if(answer.ref.type.failedAnswer === undefined || answer.ref.type.failedAnswer === '' || this.pages[p].questions[q].answers[a].value != answer.ref.type.failedAnswer)
                _complated++;
              }
              count++;
            }
          });
        });
      });
      if (count == 0) this.complated = 100;
      else this.complated = (_complated / count) * 100;
      return _complated + "/" + count;
    },
    currentUser() {
      return (id) => {
        return this.$store.getters["app/getUserById"](id).name;
      };
    },
    getFooditem() {
      return (id) => {
        if (id === undefined || id == "") return null;
        else {
          let item = this.$store.getters["app/getItemById"](id);
          if (Object.keys(item).length > 0)
            return { id: item.id, name: item.name };
          else return null;
        }
      };
    },
    foodItems() {
      let items = this.$store.getters["app/items"];
      let _items = [];
      items.map((item) => {
        if (item.discard) return;
        _items.push({ id: item.id, name: item.name });
      });
      return _items;
    },
    getTemplateType() {
      return (id) => {
        return this.$store.getters["app/getTemplateTypeById"](id);
      };
    },
    calcDate() {
      return (val) => {
        if (val.seconds !== undefined) return val.toDate();
        else return val;
      };
    },
    convNumber() {
      return (val) => {
        if (val == "") return 0;
        else val;
      };
    },
    hexToRGB() {
      return (h) => {
        if (h.includes("#") !== true) {
          if (h == "primary" || h == "success" || h == "danger" || h == "dark")
            return `rgb(var(--vs-${h}))`;
          else return h;
        } else {
          let r = 0,
            g = 0,
            b = 0;

          // 3 digits
          if (h.length == 4) {
            r = "0x" + h[1] + h[1];
            g = "0x" + h[2] + h[2];
            b = "0x" + h[3] + h[3];

            // 6 digits
          } else if (h.length == 7) {
            r = "0x" + h[1] + h[2];
            g = "0x" + h[3] + h[4];
            b = "0x" + h[5] + h[6];
          }

          return "rgb(" + +r + "," + +g + "," + +b + ")";
        }
      };
    },
    closeAnswerWidth() {
      return (length) => "sm:w-1/" + length;
    },
    labelInfo() {
      return (id) => {
        return this.$store.getters["app/getLabelById"](id);
      };
    },
    labelColor() {
      return (label) => {
        const tags = this.$store.state.email.mailTags;
        return tags.find((tag) => {
          return tag.value == label;
        }).color;
      };
    },
  },
  methods: {
    duplicateSection(pIndex, qIndex) {
      let questions = this.pages[pIndex].questions;
      let question = JSON.parse(JSON.stringify(this.pages[pIndex].questions[qIndex]));
      // question.answers[aIndex].value = new Date();

      questions.splice(qIndex+1, 0, question);
      questions.join();
      this.pages[pIndex].questions = questions;

      db.collection("logs")
        .doc(this.logID)
        .update({
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          initial: false,
          logs: this.pages,
        });

      this.$vs.notify({
        title: "Success",
        time: 7000,
        text: "You've duplicated it uccessfully",
        iconPack: "feather",
        icon: "icon-check-circle",
        color: "success",
      });
    },
    applyImage(image) {
      if (image.indexOf("firebasestorage") > -1) {
        return image;
      }
      return require(`@/assets/images/template_image/${image}`);
    },
    scrollHandle(evt) {
      if (this.signatureTop > -1)
        this.$refs.pageLists.$el.scrollTop = this.signatureTop;
    },
    saveSignAction(url, ref, indexs) {
      this.pages[indexs[0]].questions[indexs[1]].answers[indexs[2]].value = {
        url: url,
        ref: ref,
      };
      this.pages[indexs[0]].questions[indexs[1]].answers[
        indexs[2]
      ].loged = true;
      this.pages[indexs[0]].questions[indexs[1]].answers[
        indexs[2]
      ].time = new Date();
      this.pages[indexs[0]].questions[indexs[1]].answers[
        indexs[2]
      ].user = JSON.parse(localStorage.getItem("userInfo")).id;
      db.collection("logs")
        .doc(this.logID)
        .update({
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          initial: false,
          logs: this.pages,
        });
    },
    saveSign(p, q, a) {
      const { isEmpty, data } = this.$refs[
        `signaturePad_${p}_${q}_${a}`
      ][0].saveSignature();
      if (isEmpty) {
        this.$vs.notify({
          title: "Empty",
          text: "Signature is Empty.",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });
        return false;
      }
      let ref =
        JSON.parse(localStorage.getItem("userInfo")).group +
        "/" +
        JSON.parse(localStorage.getItem("userInfo")).id +
        "/logs/images/signature/" +
        new Date().getTime();
      var storageRef = storage.ref();
      var mountainsRef = storageRef.child(ref);
      var uploadTask = mountainsRef.putString(data, "data_url");
      uploadTask.on(
        "state_changed",
        (sp) => {},
        (error) => {
          this.$vs.notify({
            time: 7000,
            title: "Failed uploading",
            text:
              error.code +
              `
                Error is occured when Sign is uploding.`,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.saveSignAction(downloadURL, ref, [p, q, a]);
          });
        }
      );
    },
    clearSign(p, q, a) {
      this.$refs[`signaturePad_${p}_${q}_${a}`][0].clearSignature();
    },
    undoSign(p, q, a) {
      this.$refs[`signaturePad_${p}_${q}_${a}`][0].undoSignature();
    },
    onBegin() {
      this.signatureTop = this.$refs.pageLists.$el.scrollTop;
      // this.settings = {
      //   maxScrollbarLength: 60,
      //   wheelSpeed: 0.5,
      //   suppressScrollY: true
      // }
      // this.scrollUpdate = true
    },
    onEnd() {
      this.signatureTop = -1;
    },
    searchUserList(search, loading) {
      this.userList = [];
      loading(true);
      if (search.length == "") loading(false);
      if (search.length > 2) this.searchUser(loading, search);
    },
    searchUser(loading, search) {
      var __users = [];
      let users = this.$store.getters["app/users"].filter(
        (item) => !item.deleted && item.status
      );
      users = users.filter(
        (user) => user.name.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
      users.map((item) => {
        __users.push({ id: item.id, name: item.name });
      });
      loading(false);
      this.userList = __users;
    },

    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
    },
    removeImage(url, p, q, a) {
      this.pages[p].questions[q].answers[a].images = this.pages[p].questions[
        q
      ].answers[a].images.filter((item) => {
        if (item.url == url) {
          storage.ref().child(item.ref).delete();
        }
        return item.url != url;
      });
      this.pages[p].questions[q].answers[a].user = JSON.parse(
        localStorage.getItem("userInfo")
      ).id;
      this.pages[p].questions[q].answers[a].time = new Date();
      this.initState = false;
      this.saveState = true;
      db.collection("logs")
        .doc(this.logID)
        .update({
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          logs: this.pages,
        });
    },
    closeImage() {
      this.viewActive = false;
    },
    viewImage(src, evt) {
      var timeout;
      var eventx =
        "ontouchstart" in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)
          ? "touchstart"
          : "click";
      if (eventx == "click") {
        this.viewActive = true;
        this.viewSrc = src;
      } else {
        if (evt.type == "touchend") {
          var currentTime = new Date().getTime();
          var tapLength = currentTime - this.lastTap;
          clearTimeout(timeout);
          if (tapLength < 2000 && tapLength > 0) {
            this.viewActive = true;
            this.viewSrc = src;
            event.preventDefault();
          }
          this.lastTap = currentTime;
        }
      }
    },
    uploadSucess(url, ref, indexs) {
      this.initState = false;
      this.saveState = true;
      this.pages[indexs[0]].questions[indexs[1]].answers[
        indexs[2]
      ].images.push({ url: url, ref: ref });
      this.pages[indexs[0]].questions[indexs[1]].answers[
        indexs[2]
      ].loged = true;
      this.pages[indexs[0]].questions[indexs[1]].answers[
        indexs[2]
      ].time = new Date();
      this.pages[indexs[0]].questions[indexs[1]].answers[
        indexs[2]
      ].user = JSON.parse(localStorage.getItem("userInfo")).id;
      db.collection("logs")
        .doc(this.logID)
        .update({
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          initial: false,
          logs: this.pages,
        });
    },
    chnItem(e, pIndex, qIndex, aIndex, number = false, dropdown = false) {
      this.initState = false;
      this.saveState = true;

      if (e === null)
        this.pages[pIndex].questions[qIndex].answers[aIndex].value = "";
      else if (dropdown)
        this.pages[pIndex].questions[qIndex].answers[aIndex].value = e;
      else if (!dropdown)
        this.pages[pIndex].questions[qIndex].answers[aIndex].value = e.id;

      this.pages[pIndex].questions[qIndex].answers[aIndex].loged = true;
      this.pages[pIndex].questions[qIndex].answers[aIndex].time = new Date();
      this.pages[pIndex].questions[qIndex].answers[aIndex].user = JSON.parse(
        localStorage.getItem("userInfo")
      ).id;
      db.collection("logs")
        .doc(this.logID)
        .update({
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          initial: false,
          logs: this.pages,
        });
    },
    chnValue(e, pIndex, qIndex, aIndex, type = "", action = false) {
      if (type == "temperature") e = Math.round(e.target.value * 100) / 100;
      if (this.pages[pIndex].questions[qIndex].answers[aIndex].value === e)
        return false;

      this.initState = false;
      this.saveState = true;
      this.pages[pIndex].questions[qIndex].answers[aIndex].value = e;
      this.pages[pIndex].questions[qIndex].answers[aIndex].loged = true;
      this.pages[pIndex].questions[qIndex].answers[aIndex].time = new Date();
      this.pages[pIndex].questions[qIndex].answers[aIndex].user = JSON.parse(
        localStorage.getItem("userInfo")
      ).id;

      db.collection("logs")
        .doc(this.logID)
        .update({
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          initial: false,
          logs: this.pages,
        });

      const actions = type == "temperature" ? action : [action];

      actions.forEach((action) => {
        if (action && action.content !== undefined) {
          if (
            (action.condition == "Equal" && e == action.content[0]) ||
            (action.condition == "Not Equal" && e != action.content[0]) ||
            (action.condition == "Less Than" && e < action.content[0]) ||
            (action.condition == "Less Than or Equal" &&
              e <= action.content[0]) ||
            (action.condition == "Greater Than" && e > action.content[0]) ||
            (action.condition == "Greater Than or Equal" &&
              e >= action.content[0]) ||
            (action.condition == "Between" &&
              e >= action.content[0] &&
              e <= action.content[1])
          ) {
            var notification = this.$store.getters[
              "app/getNotificationByT_Indexes"
            ]({
              tId: this.template,
              indexes: [pIndex, qIndex, aIndex],
              logID: this.logID,
              value:
                e +
                this.pages[pIndex].questions[qIndex].answers[aIndex].ref.type
                  .tempUnit,
            });
            var templateTitle = this.templateInfo.content.templateTitle;
            var mUsers = [];
            action.toUser.map((id) => {
              let team = this.$store.getters["app/getTeamById"](id);
              if (team == undefined) return;
              let user = this.$store.getters["app/users"].filter(
                (item) => item.team.indexOf(id) > -1
              );

              user.map((item) => {
                if (mUsers.find((mUser) => mUser.email == item.email)) return;
                mUsers.push({ email: item.email, name: item.name });
              });
            });

            if (notification == undefined) {
              db.collection("notifications").add({
                readIds: [],
                sendEmails: mUsers,
                text:
                  "Captured " +
                  '"' +
                  e +
                  this.pages[pIndex].questions[qIndex].answers[aIndex].ref.type
                    .tempUnit +
                  '" in ' +
                  '"' +
                  this.pages[pIndex].questions[qIndex].title +
                  '"',
                templateIndexes: [pIndex, qIndex, aIndex],
                logID: this.logID,
                templateId: this.template,
                title: templateTitle,
                value:
                  e +
                  this.pages[pIndex].questions[qIndex].answers[aIndex].ref.type
                    .tempUnit,
                alertType: action.alertType || action.alwertType,
                toTeam: action.toUser,
                group: JSON.parse(localStorage.getItem("userInfo")).group,
                updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
                updated_at: new Date(),
                at: firebase.firestore.FieldValue.serverTimestamp(),
              });
            } else {
              db.collection("notifications")
                .doc(notification.id)
                .update({
                  sendEmails: mUsers,
                  value:
                    e +
                    this.pages[pIndex].questions[qIndex].answers[aIndex].ref
                      .type.tempUnit,
                  updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
                  updated_at: new Date(),
                  at: firebase.firestore.FieldValue.serverTimestamp(),
                  text:
                    "Captured " +
                    '"' +
                    e +
                    this.pages[pIndex].questions[qIndex].answers[aIndex].ref
                      .type.tempUnit +
                    '" in ' +
                    '"' +
                    this.pages[pIndex].questions[qIndex].title +
                    '"',
                  readIds: [],
                });
            }
          }
        }
      });
    },
    chnContent(pIndex, qIndex, aIndex, content, failed, action = false) {
      this.initState = false;
      this.saveState = true;
      this.pages[pIndex].questions[qIndex].answers[aIndex].value = content;

      this.pages[pIndex].questions[qIndex].answers[aIndex].loged = true;

      this.pages[pIndex].questions[qIndex].answers[aIndex].time = new Date();
      this.pages[pIndex].questions[qIndex].answers[aIndex].user = JSON.parse(
        localStorage.getItem("userInfo")
      ).id;

      db.collection("logs")
        .doc(this.logID)
        .update({
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          initial: false,
          logs: this.pages,
        });

      if (action && Array.isArray(action)) {
        action.map((actionItem) => {
          if (actionItem.content == content) {
            var notification = this.$store.getters[
              "app/getNotificationByT_Indexes"
            ]({
              tId: this.template,
              indexes: [pIndex, qIndex, aIndex],
              logID: this.logID,
              value: content,
            });

            if (notification == undefined) {
              var mUsers = [];
              actionItem.teams.map((id) => {
                let team = this.$store.getters["app/getTeamById"](id);
                if (team == undefined) return;
                let user = this.$store.getters["app/users"].filter(
                  (item) => item.team.indexOf(id) > -1
                );
                user.map((item) => {
                  if (
                    mUsers.find((mUser) => mUser.email == item.email) !=
                      undefined ||
                    item.rEmail === undefined ||
                    !item.rEmail
                  )
                    return;
                  mUsers.push({ email: item.email, name: item.name });
                });
              });
              db.collection("notifications").add({
                icon: "CheckSquareIcon",
                type: actionItem.types,
                readIds: [],
                sendEmails: mUsers,
                text: actionItem.description,
                logID: this.logID,
                templateIndexes: [pIndex, qIndex, aIndex],
                templateId: this.template,
                title: actionItem.name,
                value: content,
                color: actionItem.color,
                toTeam: actionItem.teams,
                group: JSON.parse(localStorage.getItem("userInfo")).group,
                updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
                updated_at: new Date(),
                at: firebase.firestore.FieldValue.serverTimestamp(),
              });
            } else {
              db.collection("notifications")
                .doc(notification.id)
                .update({
                  type: actionItem.types,
                  readIds: [],
                  sendEmails: mUsers,
                  text: actionItem.description,
                  logID: this.logID,
                  templateIndexes: [pIndex, qIndex, aIndex],
                  templateId: this.template,
                  title: actionItem.name,
                  value: content,
                  color: actionItem.color,
                  toTeam: actionItem.teams,
                  updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
                  updated_at: new Date(),
                  at: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }
          }
        });
      }
    },
    plusPage() {
      this.enterClass = "animated bounceInRight";
      this.pageNum++;
    },
    minusPage() {
      this.enterClass = "animated bounceInLeft";
      this.pageNum--;
    },
  },
  components: {
    FoodItem,
    ScoreItem,
    VuePerfectScrollbar,
    Datepicker,
    StarRating,
    VSelect,
    FileUpload,
    ViewUpload,
    flatPickr,
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    setInterval(() => (this.now = new Date()), 1000 * 60);
  },
  beforeDestroy: function () {
    window.removeEventListener("resize", this.handleWindowResize);
  },
};
</script>

<style  scoped>
@import url("https://cdn.jsdelivr.net/npm/animate.css@3.5.1");
</style>
<style scoped>
.scroll-area-task {
  height: calc(100vh - 17rem);
}
@media (max-width: 576px) {
  .scroll-area-task {
    height: calc(100vh - 11rem);
  }
}
.my-textarea {
  width: 100%;
  border-radius: 5px;
  min-height: 60px;
  padding: 10px 15px;
  font-family: "Montserrat", Helvetica, Arial, sans-serif;
  line-height: 1.6;
  font-size: 1rem;
  border-color: #cdcdcd;
}
.my-textarea:focus {
  border-color: rgba(var(--vs-primary), 1);
}
</style>

<style>
.log-sidebar .vs-sidebar.vs-sidebar-parent {
  position: inherit !important;
}
.log-sidebar .vs-sidebar {
  background: #ebebf1;
  max-width: calc(100% - 0px) !important;
  margin-top: 0 !important;
  top: 0px;
  box-shadow: none;
}
.log-sidebar .vx-card {
  box-shadow: unset;
}
</style>
<style scoped>
.answer-title {
  font-weight: 500;
  color: #1e1c26;
  opacity: 0.9;
}
.pages-container {
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.page-item:hover {
  background: rgba(var(--vs-primary), 0.1);
}
.page-item.active {
  background: rgba(var(--vs-primary), 0.1);
}
.expand-icon {
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.expand-icon.on {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.expand-icon.off {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
.page-infor {
  opacity: 0.54;
  font-size: 12px;
  color: #565656;
}
.template-title {
  font-size: 16px;
  color: #1e1c26;
}
.log-container {
  max-width: 650px;
}

.hasClockIcon::after {
  font-family: "feather" !important;
  font-style: normal;
  font-size: 20px;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1.7;
  content: "\e84d";
  position: absolute;
  top: 6px;
  right: 10px;
}
.page-title {
  font-size: 24px;
  color: #1e1c26;
}
.main-pagetitle {
  font-size: 24px;
  color: #1e1c26;
  opacity: 0.54;
}
</style>
