import {Day} from "./constants";

export const repeatEventInitialState = {
  biWeekly: false,
  weekly: true,
  monthly: false,
  daily: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
  noEndCriteria:true,
  afterEndCriteria:false,
  endByCriteria:false,
  monthlyRepeat:true,
  monthlyOn:false,
  workdays:false,
};


export const repeatEventReducer = (state, action) => {
  // console.log(action)
  switch (action.type) {
    case 'MONTHLY_REPEAT':{
      return {
        ...state,
        monthlyRepeat: true,
        monthlyOn:false,
      }
    }
    case 'MONTHLY_ON':{
      return {
        ...state,
        monthlyRepeat: false,
        monthlyOn:true,
      }
    }
    case 'AFTER_END_CRITERIA':{
      return {
        ...state,
        noEndCriteria: false,
        afterEndCriteria: true,
        endByCriteria: false
      }
    }
    case 'END_BY_CRITERIA':{
      return {
        ...state,
        noEndCriteria: false,
        afterEndCriteria: false,
        endByCriteria: true
      }
    }

    case 'NO_END_CRITERIA':{
      return {
        ...state,
        noEndCriteria: true,
        afterEndCriteria: false,
        endByCriteria: false
      }
    }

    case 'BI_WEEKLY': {
      return {
        ...state,
        biWeekly: true,
        weekly: false,
        monthly: false,
        daily: false
      };
    }
    case 'WEEKLY': {
      return {
        ...state,
        biWeekly: false,
        weekly: true,
        monthly: false,
        daily: false
      };
    }
    case 'MONTHLY': {
      return {
        ...state,
        biWeekly: false,
        weekly: false,
        monthly: true,
        daily: false
      };
    }
    case 'DAILY': {
      return {
        ...state,
        biWeekly: false,
        weekly: false,
        monthly: false,
        daily: true
      };
    }
    case 'SPACE-DAYS': {
      return {
        ...state,
        workdays: false,
        daily: true
      };
    }
    case 'WORKDAYS': {
      return {
        ...state,
        workdays: true,
        daily: true
      };
    }
    case 'RESET': {
      return { ...repeatEventInitialState };
    }
    case Day.MONDAY: {
      return {
        ...state,
        monday:action.value
      };
    }
    case Day.TUESDAY: {
      return {
        ...state,
        tuesday:action.value
      };
    }
    case Day.WEDNESDAY: {
      return {
        ...state,
        wednesday:action.value
      };
    }
    case Day.THURSDAY: {
      return {
        ...state,
        thursday:action.value
      };
    }
    case Day.FRIDAY: {
      return {
        ...state,
        friday:action.value
      };
    }
    case Day.SATURDAY: {
      return {
        ...state,
        saturday:action.value
      };
    }
    case Day.SUNDAY: {
      return {
        ...state,
        sunday:action.value
      };
    }
    default: return state;
  }
}
