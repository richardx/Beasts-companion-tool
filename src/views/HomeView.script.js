import { ref } from 'vue';
import beasts from '../../assets/beasts.json';

const beastList = ref(beasts);

export default {
  setup() {
    return { beastList };
  },
};
