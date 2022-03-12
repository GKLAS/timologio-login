chrome.runtime.onMessage.addListener(msg => {
    document.getElementsByName('UserName')[0].value = msg.userName
    document.getElementsByName('VatNumber')[0].value = msg.vatNumber
    document.getElementsByName('SubscriptionKey')[0].value = msg.subscriptionKey
    return true
})