import { config } from '@vue/test-utils';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import Toast from 'primevue/toast';
import Toolbar from 'primevue/toolbar';
import Tooltip from 'primevue/tooltip';

config.global = {
  components: {
    Button,
    Column,
    DataTable,
    Dialog,
    InputNumber,
    InputText,
    TabPanel,
    TabView,
    Toast,
    Toolbar,
  },
  directives: {
    Tooltip
  }
};

export default config;
