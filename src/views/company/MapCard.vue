<template>
  <vx-card>
    <div slot="no-body" class="p-2">
      <gmap-map :center="center" :zoom="2" style="width: 100%; height: 200px;">
        <gmap-info-window
          :options="infoOptions"
          :position="infoWindowPos"
          :opened="infoWinOpen"
          @closeclick="infoWinOpen=false"
        >{{infoContent}}</gmap-info-window>
        <gmap-marker
          :key="i"
          v-for="(m,i) in markers"
          :position="m.position"
          :clickable="true"
          @click="toggleInfoWindow(m,i)"
        ></gmap-marker>
      </gmap-map>
    </div>
  </vx-card>
</template>
<script>
export default {
  data() {
    return {
      center: { lat: 47.376332, lng: 8.547511 },
      infoContent: "",
      infoWindowPos: null,
      infoWinOpen: true,
      currentMidx: null,
      //optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: { width: 0, height: -35 },
      },
    };
  },
  methods: {
    setPlace(place) {},
    toggleInfoWindow: function (marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoContent = marker.infoText;
      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
  },
  computed: {
    markers() {
      var cUser = this.$store.getters["app/currentUser"]
      var locationList = this.$store.getters['app/locationList']
      if(locationList.length==0) {
        if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key>0) {
          if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
            locationList = cUser.location
          } else {
            locationList = ['no']
          }
        }
      }
      var locations = this.$store.getters["app/locations"].filter(item=> {
        if(locationList.length > 0) {
          if(locationList.indexOf(item.id)<0) return false
        }
        return !item.deleted 
      });
      let markers = [];
      locations.map((item) => {
        markers.push({
          position: {
            lat: item.address.latitude,
            lng: item.address.longitude,
          },
          infoText: item.name,
        });
      });

      return markers;
    },
  },
};
</script>
<style scoped>
.h-100 {
  height: 485px;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>