

export type ContentEvent = {
  id?:number
  title: string
  dateFullName: string
  hour: string
  link?: string
  img: string | null
  eventType: string
  location:string
  date:string
  description:string
  startTime:any
  endTime:any
  startDate:any
  endDate:any
}

export enum EVENT_TYPE {
  Story='story',
  Event='event'
}
