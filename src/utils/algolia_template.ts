export const rework = (data): string => {
  // console.log(data)
  const template = `<a href='${data.permalink}' class='rework-item tile' target='_blank'>
    <div class='tile-icon'><img src='${data.image}'/></div>
    <div class='tile-content'>
      <h2 class='tile-title'>${data.title}</h2>
      <h3 class='tile-subtitle'>${data.description}</h3>
    </div>
  </a>`
  return template
}

export const electron = (data): string => {
  const template = `<a href='${data.url}' class='rework-item tile' target='_blank'>
    <div class='tile-content'>
      <h2 class='tile-title'>${data.fullSignature}</h2>
      <h3 class='tile-subtitle'>${data.description}</h3>
    </div>
  </a>`
  return template 
}

export const ember = (data): string => {
  const template = `<a href='https://guides.emberjs.com/release/${data.path}' class='rework-item tile' target='_blank'>
    <div class='tile-content'>
      <h2 class='tile-title'>${data.headings.join('/')}</h2>
      <h3 class='tile-subtitle'>${data.content}</h3>
    </div>
  </a>`
  return template 
}
