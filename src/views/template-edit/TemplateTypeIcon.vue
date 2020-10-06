<template>
  <div class="icon">
    <!-- ======================Opened Answers========================== -->
    <svg
      v-if="templateType(item) == 'number'"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.12"
        d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
        fill="#EB5743"
      />
      <path
        d="M7.504 12.8C8.104 12.712 8.632 12.5 9.088 12.164H10.156V20H8.74V13.856C8.332 14.056 7.92 14.156 7.504 14.156V12.8ZM13.1851 18.704H17.6371V20H11.7691V18.668C11.7691 17.732 12.1011 17.052 12.7651 16.628C12.9891 16.484 13.2491 16.356 13.5451 16.244L15.1411 15.632C15.4931 15.496 15.7491 15.328 15.9091 15.128C16.0771 14.92 16.1611 14.664 16.1611 14.36C16.1611 14.056 16.0531 13.804 15.8371 13.604C15.6211 13.396 15.3131 13.292 14.9131 13.292C14.5131 13.292 14.1811 13.388 13.9171 13.58C13.6611 13.772 13.5131 14.056 13.4731 14.432H11.9011C11.9171 13.672 12.2091 13.076 12.7771 12.644C13.2971 12.252 13.9971 12.056 14.8771 12.056C15.6851 12.056 16.3531 12.272 16.8811 12.704C17.4171 13.152 17.6851 13.7 17.6851 14.348C17.6851 14.996 17.5211 15.516 17.1931 15.908C16.8731 16.292 16.3731 16.616 15.6931 16.88L14.0731 17.504C13.7611 17.624 13.5331 17.76 13.3891 17.912C13.2531 18.056 13.1851 18.244 13.1851 18.476V18.704ZM21.7827 13.34C20.9107 13.34 20.4027 13.672 20.2587 14.336H18.7707C18.8507 13.568 19.1627 12.988 19.7067 12.596C20.2187 12.236 20.8907 12.056 21.7227 12.056C22.5787 12.056 23.2747 12.256 23.8107 12.656C24.3707 13.064 24.6507 13.588 24.6507 14.228C24.6507 14.628 24.5427 14.976 24.3267 15.272C24.1107 15.56 23.7907 15.776 23.3667 15.92C23.8387 16.08 24.2147 16.32 24.4947 16.64C24.7827 16.952 24.9267 17.312 24.9267 17.72C24.9267 18.128 24.8507 18.476 24.6987 18.764C24.5547 19.052 24.3467 19.3 24.0747 19.508C23.4987 19.948 22.7507 20.168 21.8307 20.168C20.9507 20.168 20.2107 19.944 19.6107 19.496C18.9387 19.008 18.6027 18.36 18.6027 17.552H20.1147C20.1387 17.96 20.3027 18.28 20.6067 18.512C20.9187 18.744 21.3227 18.86 21.8187 18.86C22.3147 18.86 22.6987 18.752 22.9707 18.536C23.2507 18.312 23.3907 18.032 23.3907 17.696C23.3907 17.352 23.2627 17.084 23.0067 16.892C22.7587 16.7 22.3627 16.604 21.8187 16.604H20.7867V15.488H21.6747C22.1307 15.488 22.4867 15.392 22.7427 15.2C22.9987 15 23.1267 14.74 23.1267 14.42C23.1267 14.1 23.0147 13.84 22.7907 13.64C22.5747 13.44 22.2387 13.34 21.7827 13.34Z"
        fill="#EB5743"
      />
    </svg>

    <svg
      v-else-if="templateType(item) == 'signature'"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.12"
        d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
        fill="#EB5743"
      />
      <path
        style="fill: rgb(235, 87, 67);transform: scale(0.7) translateX(10px) translateY(10px);"
        d="M18.724,9.903l3.855,1.416l-3.206,8.729c-0.3,0.821-1.927,3.39-3.06,3.914l-0.275,0.75
		c-0.07,0.19-0.25,0.309-0.441,0.309c-0.054,0-0.108-0.01-0.162-0.029c-0.243-0.09-0.369-0.359-0.279-0.604l0.26-0.709
		c-0.575-1.117-0.146-4.361,0.106-5.047L18.724,9.903z M24.303,0.667c-1.06-0.388-2.301,0.414-2.656,1.383l-2.322,6.326l3.854,1.414
		l2.319-6.325C25.79,2.673,25.365,1.056,24.303,0.667z M17.328,9.576c0.108,0.04,0.219,0.059,0.327,0.059
		c0.382,0,0.741-0.234,0.882-0.614l2.45-6.608c0.181-0.487-0.068-1.028-0.555-1.208c-0.491-0.178-1.028,0.068-1.209,0.555
		l-2.45,6.608C16.592,8.855,16.841,9.396,17.328,9.576z M13.384,21.967c-0.253-0.239-0.568-0.537-1.078-0.764
		c-0.42-0.187-0.829-0.196-1.128-0.203c-0.031,0-0.067-0.001-0.103-0.002c-0.187-0.512-0.566-0.834-1.135-0.96
		c-0.753-0.159-1.354,0.196-1.771,0.47c0.037-0.21,0.098-0.46,0.143-0.64c0.144-0.58,0.292-1.18,0.182-1.742
		c-0.087-0.444-0.462-0.774-0.914-0.806c-1.165-0.065-2.117,0.562-2.956,1.129c-0.881,0.595-1.446,0.95-2.008,0.749
		c-0.686-0.244-0.755-2.101-0.425-3.755c0.295-1.49,0.844-4.264,2.251-5.524c0.474-0.424,1.16-0.883,1.724-0.66
		c0.663,0.26,1.211,1.352,1.333,2.653c0.051,0.549,0.53,0.952,1.089,0.902c0.55-0.051,0.954-0.539,0.902-1.089
		c-0.198-2.12-1.192-3.778-2.593-4.329C6.058,7.07,4.724,6.982,3.107,8.429c-1.759,1.575-2.409,4.246-2.88,6.625
		c-0.236,1.188-0.811,5.13,1.717,6.029c1.54,0.549,2.791-0.298,3.796-0.976c0.184-0.124,0.365-0.246,0.541-0.355
		c-0.167,0.725-0.271,1.501,0.167,2.155c0.653,0.982,1.576,1.089,2.742,0.321c0.045-0.029,0.097-0.063,0.146-0.097
		c0.108,0.226,0.299,0.475,0.646,0.645c0.42,0.206,0.84,0.216,1.146,0.224c0.131,0.003,0.31,0.007,0.364,0.031
		c0.188,0.083,0.299,0.185,0.515,0.389c0.162,0.153,0.333,0.312,0.55,0.476c0.18,0.135,0.39,0.199,0.598,0.199
		c0.304,0,0.605-0.139,0.801-0.4c0.331-0.442,0.241-1.069-0.201-1.4C13.61,22.183,13.495,22.072,13.384,21.967z"
      />
    </svg>
    <feather-icon
      v-else-if="templateType(item) == 'temperature'"
      icon="ThermometerIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#EB5743;background:rgba(235, 87, 67,.12) "
    />
    <feather-icon
      v-else-if="templateType(item) == 'date'"
      icon="CalendarIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#EB5743;background:rgba(235, 87, 67,.12) "
    />
    <feather-icon
      v-else-if="templateType(item) == 'instruction'"
      icon="InfoIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#EB5743;background:rgba(235, 87, 67,.12) "
    />
    <feather-icon
      v-else-if="templateType(item) == 'checkbox'"
      icon="CheckSquareIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#EB5743;background:rgba(235, 87, 67,.12) "
    />
    <feather-icon
      v-else-if="templateType(item) == 'date time'"
      icon="CalendarIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#EB5743;background:rgba(235, 87, 67,.12) "
    />

    <feather-icon
      v-else-if="templateType(item) == 'short answer'"
      icon="TypeIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#EB5743;background:rgba(235, 87, 67,.12) "
    />

    <feather-icon
      v-else-if="templateType(item) == 'paragraph'"
      icon="TypeIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#EB5743;background:rgba(235, 87, 67,.12) "
    />

    <feather-icon
      v-else-if="templateType(item) == 'drop down'"
      icon="ChevronDownIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#EB5743;background:rgba(235, 87, 67,.12) "
    />

    <!-- ======================Calculation Fields========================== -->
    <feather-icon
      v-else-if="templateType(item) == 'star'"
      icon="StarIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#1e1c26;background:#f5f5fa "
    />

    <feather-icon
      v-else-if="templateType(item) == 'score'"
      icon="ThumbsUpIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#1e1c26;background:#f5f5fa "
    />

    <!-- ======================Smart Fields========================== -->
    <feather-icon
      v-else-if="templateType(item) == 'automatic date and time stamp'"
      icon="CalendarIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#29b648;background:rgba(41, 182, 72,.12); "
    />
    <feather-icon
      v-else-if="templateType(item) == 'automatic user stamp'"
      icon="UserCheckIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#29b648;background:rgba(41, 182, 72,.12); "
    />
    <feather-icon
      v-else-if="templateType(item) == 'items'"
      icon="ServerIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#29b648;background:rgba(41, 182, 72,.12); "
    />
    <feather-icon
      v-else-if="templateType(item) == 'teams'"
      icon="UsersIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#29b648;background:rgba(41, 182, 72,.12); "
    />
    <feather-icon
      v-else-if="templateType(item) == 'users'"
      icon="UsersIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#29b648;background:rgba(41, 182, 72,.12); "
    />

    <!-- ======================Attachement========================== -->
    <feather-icon
      v-else-if="templateType(item) == 'photo'"
      icon="ImageIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#6c50f0;background:rgba(108, 80, 240,0.12); "
    />
    <feather-icon
      v-else-if="templateType(item) == 'receipts'"
      icon="FileTextIcon"
      class="rounded-full"
      style="width:32px; height:32px; padding:8px; color:#6c50f0;background:rgba(108, 80, 240,0.12); "
    />
  </div>
</template>
<script>
import { db } from "../../firebase/firebaseConfig";
export default {
  props: {
    item: String,
    default: "",
  },
  computed: {
    templateType() {
      return (id) => {
        if (id === undefined) return "";
        else if (
          this.$store.getters["app/getTemplateTypeById"](id) === undefined
        )
          return "";
        else return this.$store.getters["app/getTemplateTypeById"](id).content;
      };
    },
  },
};
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: top;
  width: 32px;
  height: 32px;
}
</style>