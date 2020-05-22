export const reworkUrl = (data): string => data.permalink
export const rework = (data): string => {
  const template = `<a href='${reworkUrl(data)}' class='rework-item tile' target='_blank'>
    <div class='tile-icon'><img src='${data.image}'/></div>
    <div class='tile-content'>
      <h2 class='tile-title'>${data.title}</h2>
      <h3 class='tile-subtitle'>${data.description}</h3>
    </div>
  </a>`
  return template
}

export const electronUrl = (data): string => data.url
export const electron = (data): string => {
  const template = `<a href='${electronUrl(data)}' class='rework-item tile' target='_blank'>
    <div class='tile-content'>
      <h2 class='tile-title'>${data._highlightResult.fullSignature.value}</h2>
      <h3 class='tile-subtitle'>${data._highlightResult.description.value}</h3>
    </div>
  </a>`
  return template
}

export const emberUrl = (data): string => `https://guides.emberjs.com/release/${data.path}`
export const ember = (data): string => {
  const template = `<a href='${emberUrl(data)}' class='rework-item tile' target='_blank'>
    <div class='tile-content'>
      <h2 class='tile-title'>${data._highlightResult.headings.map((h) => h.value).join("/")}</h2>
      <h3 class='tile-subtitle'>${data._highlightResult.content.value}</h3>
    </div>
  </a>`
  return template
}

export const kotlinUrl = (data): string => `https://kotlinlang.org${data.url}`
export const kotlin = (data): string => {
  const template = `<a href='${kotlinUrl(data)}' class='rework-item tile' target='_blank'>
    <div class='tile-content'>
      <h2 class='tile-title'>${data._highlightResult.type.value} / ${data._highlightResult.headings.value}</h2>
      <h3 class='tile-subtitle'>${data._highlightResult.content.value}</h3>
    </div>
  </a>`
  return template
}

export const cocoapodsUrl = (data): string => data.homepage
export const cocoapods = (data): string => {
  const template = `<a href='${cocoapodsUrl(data)}' class='rework-item tile' target='_blank'>
    <div class='tile-content'>
      <h2 class='tile-title'>${data._highlightResult.name.value}</h2>
      <h3 class='tile-subtitle'>${data._highlightResult.summary.value}</h3>
    </div>
  </a>`
  return template
}

export const getAutocompleteTemplate = (code: string): ((data: any) => string) => {
  let template = rework
  if (code === "electron") {
    template = electron
  } else if (code === "ember") {
    template = ember
  } else if (code === "kotlin") {
    template = kotlin
  } else if (code === "cocoapods") {
    template = cocoapods
  }
  return template
}

export const getAutocompleteUrl = (code: string, data: any): string => {
  let url = ""
  if (code === "electron") {
    url = electronUrl(data)
  } else if (code === "ember") {
    url = emberUrl(data)
  } else if (code === "kotlin") {
    url = kotlinUrl(data)
  } else if (code === "cocoapods") {
    url = cocoapodsUrl(data)
  } else {
    url = rework(data)
  }
  return url
}
