import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { useLongPress } from 'use-long-press';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Data {
  images : {
    jpg : {
      image_url : string
    }
  },
  rank : number,
  title : string,
  rating : string,
  aired : {
    string : string
  },
  year : number
}

function App() {
  const [data,setData] = useState<Data[]>([]);
  const [index,setIndex] = useState<number>(0);
  const [data2,setData2] = useState<Data[]>();

  useEffect(function(){
    axios.get("https://api.jikan.moe/v4/top/anime").then(function(res){
      setData(res.data.data.slice(0,20));
      setData2(res.data.data.slice(0,20).sort((a:Data,b:Data) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)))
    })
  },[]);

  const Bind = useLongPress(() => {
    let item = document.getElementsByClassName("item")[index] as HTMLElement;
    item.style.animationName = "bigger";
    item.style.animationPlayState = "running";

    let p = document.getElementsByClassName("p")[index] as HTMLElement;
    p.classList.remove("hidden");
  },{
    onFinish: event => {
      let item = document.getElementsByClassName("item")[index] as HTMLElement;
      item.style.animationName = "smaller";
      item.style.animationPlayState = "running";
      
      let p = document.getElementsByClassName("p")[index] as HTMLElement;
      p.classList.add("hidden");
    }
  });

  function HandleOver(index:number){
    setIndex(index);
  }
  return (
    <div className="p-10">
      <div className='grid gap-5 grid-auto-fit-xs'>
        {data.map(function(item:Data,index:number){
          let str = item.aired.string.split("to");
          return (
            <div className='w-[300px] '>
            <div onMouseOver={() => HandleOver(index)} className='item relative cursor-pointer w-[200px] h-[300px] bg-white rounded-2xl' {...Bind(index)} key={index}>
              <div className='absolute right-0 bg-pink-400 rounded-tr-2xl w-7 h-7 flex justify-center items-center'>
                <p className='text-right'>{item.rank}</p>
              </div>
              <img className="w-full h-[250px] rounded-t-2xl" src={item.images.jpg.image_url}></img>
              <div className='p-1 w-full h-12'>
                <p className='text-center'>
                  {item.title.length > 32 ? item.title.slice(0,32)+"..." : item.title
                  }
                  </p>
                  <div className='p hidden'>
                <p className='text-center'><strong>Release</strong> : {str[0]}</p>
                <p className='text-center'>{str[1] ? <div><strong>Lastest</strong> : {str[1]}</div> : <div><strong>Lastest</strong> : Now</div>}</p>
                <p className='text-center'><strong>Rating</strong> : {item.rating}</p>
              </div>
              </div>
            </div>
            </div>
          )
        })}
      </div>
      <div >
      <ResponsiveContainer width="95%" height={400}>
      <AreaChart data={data2}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.8}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="year" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="rank" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
      </AreaChart>
      </ResponsiveContainer>
  </div>
    </div>
  );
}

export default App;
