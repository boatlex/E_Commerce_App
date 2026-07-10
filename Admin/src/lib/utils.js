
export const capitalizedText = (text)=>{
 return text.charAt(0).toUpperCase() + text.slice(1)
}

export const getOrderStatusBadge = (status)=>{
    switch (status?.toLowerCase()) {
        case delivered:
            return "badge-success"
        case shipped:
            return "badge-info"
        case pending:
            return "badge-warning"
        case cancelled:
            return "badge-danger"
    
        default:
            return "badge-ghost";
    }
}

export const getStockStatusBadge = (stock)=>{
    if(stock ===0) return {text:"Out of stock", class:"badge-error"}
    if(stock <10) return {text:"Low stock", class:"badge-warning"}
    return {text:"In stock", class:"badge-success"}
}

export const formatDate = (dateString)=>{
 return new Date(dateString).toLocaleDateString("en-US", {
  month :"short",
  day :"numeric",
  year:"numeric",
 })
}