import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { api } from '@/bindings/api';
import { Link } from '@/components';
import { ColorMode, colorModeList, useColorMode } from '@/utils/theme';

export default function Index() {
  const { colorMode, currentColorMode, setColorMode } = useColorMode();

  const [logs, setLogs] = useState<string[]>([]);

  // const [vd, setVd] = useState<Vditor>();
  // useEffect(() => {
  //   const vditor = new Vditor('vditor', {
  //     after: () => {
  //       vditor.setValue('`Vditor` 最小代码示例');
  //       setVd(vditor);
  //     },
  //     cdn: '/libs/vditor',
  //     theme: 'classic',
  //   });
  //   // Clear the effect
  //   return () => {
  //     vd?.destroy();
  //     setVd(undefined);
  //   };
  // }, []);

  let currentLogs = logs;
  const appendLog = (log: string) => {
    console.log(log);
    const newLogs = [...currentLogs, log];
    currentLogs = newLogs;
    setLogs(newLogs);
  };
  const logTime = (label: string, start: number) => {
    appendLog(`${label} ${(performance.now() - start).toFixed(2)}ms`);
  };

  async function helloCommand() {
    const msg: string[] = [];
    for (let i = 0; i < 1000000; i++) {
      msg.push(`test ts${i}`);
    }
    const start = performance.now();
    const data = await api.helloCommand(msg);
    logTime('hello_command: ' + data?.length, start);

    console.log(data);
  }

  async function helloCommandAsync() {
    const msg: string[] = [];
    for (let i = 0; i < 1000000; i++) {
      msg.push(`test ts${i}`);
    }
    const start = performance.now();
    const data = await api.helloCommandAsync(msg);
    logTime('hello_command_async: ' + data?.length, start);

    console.log(data);
  }

  return (
    <div style={{ backgroundColor: 'transparent', margin: '10px' }}>
      <div>
        <Link to="/about">About Page</Link>
        <div>
          {/* <Separator className="my-4" /> */}
          <div>
            <button onClick={helloCommand}>helloCommand</button>
            <button onClick={helloCommandAsync}>helloCommandAsync</button>
            <button onClick={() => toast('TestToast')}>Toast</button>
          </div>
          <div style={{ width: 200 }}>
            <select
              value={currentColorMode}
              onChange={(e) => {
                const v = e.target.value;
                if (v) {
                  console.log(v);
                  setColorMode(v as ColorMode);
                }
              }}
            >
              {colorModeList.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div>current: {currentColorMode}</div>
            <div>theme: {colorMode}</div>
          </div>
          <div>
            {logs.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
          <div id="vditor" className="vditor" />
        </div>
      </div>
    </div>
  );
}
