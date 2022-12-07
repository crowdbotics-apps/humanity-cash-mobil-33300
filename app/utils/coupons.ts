import { useStores } from "../models";
import { runInAction } from "mobx"
import { notifyMessage } from "./helpers";

const refreshCouponState = (loginStore) => loginStore.environment.api
    .getConsumerCoupons()
    .then((result: any) => {
        if (result.kind === "ok") {
            //console.log('CONSUMER COUPONS =============>', result.data)
            runInAction(() => {
                loginStore.setConsumerCoupons(result.data?.results)
            })

        } else if (result.kind === "bad-data") {
            const key = Object.keys(result?.errors)[0]
            const msg = `${key}: ${result?.errors?.[key][0]}`
            notifyMessage(msg)
        } else {
            notifyMessage(null)
        }
    })

export const addConsumerCoupon =  (coupon_id: number, props, loginStore): Promise<void> => {
    return loginStore.environment.api.getProfileConsumer()
    .then((response) => 
        loginStore.environment.api
        .postConsumerCoupon({
            //@ts-ignore
            consumer: response.data.consumer, 
            coupon: coupon_id, 
            active: true
        })
        .then((res) => res.kind === 'ok' && [refreshCouponState(loginStore)])
        .catch(error => console.log(`Ocurrió un error al agregar un cupón del consumer: ${error.message}`))

    ).catch(error => console.log(`Ocurrió un error al querer conseguir la información del consumer: ${error.message}`))
}

export const deleteConsumerCoupon = (coupon_id: number, props, loginStore ): Promise<void> => {
    return loginStore.environment.api.getConsumerCoupons()
    .then(response => {
        if(response.kind === 'ok') {
            //@ts-ignore
            const couponToDelete = response?.data?.results.find(c => c.id_cupon === coupon_id)
            const {id} = couponToDelete;
            loginStore.environment.api.deleteConsumerCoupon(id)
            .then(res => res.kind === 'ok' && [refreshCouponState(loginStore)])
            .catch(error => console.log(`Ocurrió un error al querer eliminar el cupón del consumer: ${error.message}`))
        }
    }).catch(error => console.log(`Ocurrió un error al querer conseguir los cupones del consumer: ${error.message}`))
}