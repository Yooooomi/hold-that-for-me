// import s from './App.module.css';
import { useCallback, useRef, useState } from 'react';
import './App.css';

let inter = null;
const api = process.env.REACT_APP_API || 'http://localhost:8080';

function App() {
  const [link, setLink] = useState('');
  const [quicklink, setQuickLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(quicklink);
    setCopied(true);
    if (inter != null) {
      clearInterval(inter);
    }
    inter = setInterval(() => {
      setCopied(false);
    }, 400);
  }, [inter, quicklink]);

  const createLink = useCallback(async () => {
    const res = await fetch(`${api}/link`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ link }),
    });
    const json = await res.json();
    setQuickLink(`${api}/${json.key}`);
  }, [link]);

  return (
    <form className="root" onSubmit={ev => ev.preventDefault() || createLink()}>
      <h1>Convert anything to a quick link</h1>
      <div>
        {!quicklink && (
          <input
            className="input"
            placeholder="Link..."
            value={link}
            onChange={ev => setLink(ev.target.value)}
          />
        )}
        {quicklink && (
          <h3 className="link">
            <button type="button" onClick={copy}>{quicklink}</button>
            <span style={{ opacity: copied ? 1 : 0 }} className="copied">
              Copied!
          </span>
          </h3>
        )}
      </div>
      <div>
        <button
          style={{ opacity: quicklink ? 0 : 1 }}
          disabled={!!quicklink}
          className="button"
          type="submit"
        >
          Convert to a quick link
          </button>
      </div>
    </form>
  );
}

export default App;
