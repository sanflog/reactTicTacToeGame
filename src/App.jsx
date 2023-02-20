import Game from './game.jsx';
import { createRoot } from 'react-dom/client';

const app = createRoot(document.getElementById('app'));
app.render(
	<Game />
);

