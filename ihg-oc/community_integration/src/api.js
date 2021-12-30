import axios from 'axios'
import _ from 'lodash'

let categories = null
let sources = null
let tags = null

const transformCategories = categories => categories.map(category => ({
  id: category.id,
  name: category.name
}))

const transformSources = sources => sources.map(source => ({
  id: source.id,
  name: source.name
}))

const transformTags = tags => tags.map(tag => ({
  id: tag.id,
  name: tag.name
}))

const transformResources = resources => resources.map(resource => ({
  id: resource.id,
  categories: categories ? categories.filter(t => resource.categories.split(',').includes(t.id)) : null,
  source: sources ? (sources.find(s => s.id === resource.source) || null) : null,
  tags: tags ? tags.filter(t => resource.tags.split(',').includes(t.id)) : null,
  image: `https://oc.hotsauceatl.com${resource.image}`,
  title: _.unescape(resource.title),
  excerpt: _.unescape(resource.summary),
  content: _.unescape(resource.content),
  attachments: _.unescape(resource.attachments)
}))

const needs = async (types, promise) => {
  const promises = [promise]

  if (types.includes('categories') && categories === null) {
    promises.push(getCategories())
  }

  if (types.includes('sources') && sources === null) {
    promises.push(getSources())
  }

  if (types.includes('tags') && tags === null) {
    promises.push(getTags())
  }

  const results = await Promise.all(promises)

  return results[0]
}

export const getCategories = async () => {
  if (categories === null) {
    const response = await axios.get('https://oc.hotsauceatl.com/api/v1/categories')
    categories = transformCategories(response.data)
  }

  return categories
}

export const getSources = async () => {
  if (sources === null) {
    const response = await axios.get('https://oc.hotsauceatl.com/api/v1/sources')
    sources = transformSources(response.data)
  }

  return sources
}

export const getTags = async () => {
  if (tags === null) {
    const response = await axios.get('https://oc.hotsauceatl.com/api/v1/tags')
    tags = transformTags(response.data)
  }

  return tags
}

export const getResourcesQueue = async queueName => {
  const response = await needs(
    ['categories', 'sources', 'tags'],
    axios.get(`https://oc.hotsauceatl.com/api/v1/resources/queue/${encodeURIComponent(queueName)}`)
  )

  return transformResources(response.data)
}

export const getResource = async resourceId => {
  const response = await needs(
    ['tags'],
    axios.get(`https://oc.hotsauceatl.com/api/v1/resources/${encodeURIComponent(resourceId)}`)
  )

  return response.data.length === 1
    ? transformResources(response.data)[0]
    : null
}
