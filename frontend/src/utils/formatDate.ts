import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

const formatDate = (date: Date): string =>
  format(parseISO(date.toString()), 'P', { locale: pt });

export default formatDate;
