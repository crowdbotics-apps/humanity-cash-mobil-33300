import moment from 'moment'

export const event_list = [
  {
    title: '2022-09-06',
    events: [
      {
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR01s-Q5BArIfe33QD6EJdKT_DcT_5Iv9cFzIQdBeuhnSrxrNSF_ssES_E4UaK3S9r73Sk&usqp=CAU',
        title: 'Story title',
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint  Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint ',
        date: '2022-09-01 07:00',
        location: 'Address, Country',
        eventType: 'story',
        isOverlapping: false
      }]
  },
  {
    title:'2022-09-02',
    events:[
      {
        img:'https://limetray.com/blog/wp-content/uploads/2020/01/steel-011Lead-1200x800.jpg',
        title:'Story Title',
        description:'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint... Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint',
        date: '2022-09-02 10:00',
        link:"https://www.google.com",
        eventType:'story',
        isOverlapping:true
      },
      {
        img:'',
        title:'Event Title',
        description:'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint... Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint',
        date: '2022-09-02 10:10',
        location:'Address, Country',
        eventType:'event',
        startTime:'2022-09-02 10:10',
        endTime:'2022-09-02 11:10',
        startDate:moment().date(),
        endDate:moment().date(),
        isOverlapping:true
      }
    ]
  }
]
