import React from 'react'

// 高亮关键字
export const Mark = ({name, keyword}:{name:string,keyword:string})=> {
  if(!keyword) {
    return <>{name}</>
  }

  const arr = name.split(keyword)

  // 匹配到的每个元素后面都有一个关键字,除了数组最后一个
  return <>
  {
    arr.map((str:string, index: number)=> <span key={index}>
    {str}
    {
      index === arr.length - 1 ? null: <span style={{color:'#257AFD'}}>
        {keyword}
      </span>
    }
    </span>)
  }</>
}
