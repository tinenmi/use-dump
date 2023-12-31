import { useState, useEffect, useCallback } from 'react'

let globalState = {}
let globalStateSubscribers = {}

let registerSubscriber = (prop, subscriber) => {
  if (globalStateSubscribers[prop]) {
    globalStateSubscribers[prop].push(subscriber)
  } else {
    globalStateSubscribers[prop] = [subscriber]
  }
}

let unregisterSubscriber = (prop, subscriber) => {
if (globalStateSubscribers[prop].length === 1) {
    delete globalStateSubscribers[prop]
  } else {
    globalStateSubscribers[prop] = globalStateSubscribers[prop].filter(x => x !== subscriber)
  }
}

export let useDump = (prop) => {
  let [value, setValue] = useState(globalState[prop]);

  let valueChanging = useCallback((newValue) => {
    setValue(newValue)
  }, [setValue]);

  useEffect(() => {
    registerSubscriber(prop, valueChanging)
    return () => {
      unregisterSubscriber(prop, valueChanging)
    }
  }, [])

  let changeValue = (newValue) => {
    globalState[prop] = newValue
    for(let subscriber of globalStateSubscribers[prop]) {
      subscriber(newValue)
    }
  }

  return [value, changeValue]
}

export let useDumpSetup = (prop, value) => {
  let [_, setValue] = useDump(prop)
  useEffect(() => { setValue(value)}, []) 
}