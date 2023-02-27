const app = Vue.createApp({
    el: '#demo',
    data() {
        return {
            loginFilter: '',
            statusFilter: '',
            minFilter: '',
            maxFilter: '',

            gridColumns: ['Место', 'Логин', 'Подтвержденные заказы', 'Статус'],
            gridData: [
                {
                    Место: 1, Логин: 'smith@gmail.com', 'Подтвержденные заказы': 312, Статус: 'Ценитель красоты'
                },
                { Место: 2, Логин: 'lenin@gmail.com', 'Подтвержденные заказы': 120, Статус: 'Поставщик аксессуаров' },
                { Место: 3, Логин: 'mask@gmail.com', 'Подтвержденные заказы': 98, Статус: 'Конкурент минздрава' },
                { Место: 4, Логин: 'dog@mail.ru', 'Подтвержденные заказы': 64, Статус: 'рыбак' },
                { Место: 5, Логин: 'nightmare@mail.ru', 'Подтвержденные заказы': 34, Статус: 'охотник' },
                { Место: 6, Логин: 'cat@mail.ru', 'Подтвержденные заказы': 1, Статус: 'Ценитель красоты' }
            ]
        }
    }
})

// определение компонента
app.component('demo-grid', {
    template: '#grid-template', //шаблон
    props: {
        info: Array,
        columns: Array,
        loginKey: String,
        statusKey: String,
        maxKey: String,
        minKey: String
    }, //массив со свойствами

    //начальное состояние данных
    data() {
        const sortOrders = {};
        this.columns.forEach(function (key) {
            sortOrders[key] = 1;
        });
        return {
            sortKey: '',
            sortOrders
        }
    },

    //вычисляемые свойства
    computed: {
        filteredinfo() {
            const sortKey = this.sortKey;
            const loginKey = this.loginKey && this.loginKey.toLowerCase()
            const statusKey = this.statusKey && this.statusKey.toLowerCase()
            const minKey = this.minKey
            const maxKey = this.maxKey
            const order = this.sortOrders[sortKey] || 1;
            let info = this.info;

            //Фильтр "Логин"
            if (loginKey) {
                info = info.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return (
                            key !== "Место" && key !== "Подтвержденные заказы" && key !== "Статус" &&
                            String(row[key])
                                .toLowerCase()
                                .indexOf(loginKey) > -1
                        );
                    });
                });
            }

            //Фильтр "Статус"
            if (statusKey) {
                info = info.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return (
                            key !== "Место" && key !== "Подтвержденные заказы" && key !== "Логин" &&
                            String(row[key])
                                .toLowerCase()
                                .indexOf(statusKey) > -1
                        );
                    });
                });
            }

            //Фильтр "Подтвержденные заказы"
            if (minKey && maxKey) {
                info = info.filter(function (row) {
                    if (row["Подтвержденные заказы"] >= parseInt(minKey) &&
                        row["Подтвержденные заказы"] <= parseInt(maxKey)) {
                        return true;
                    }
                    return false;
                });
            } else if (minKey) { //работа фильтра сразу после введения минимального значения
                info = info.filter(function (row) {
                    if (row["Подтвержденные заказы"] >= parseInt(minKey)) {
                        return true;
                    }
                    return false;
                });
            }
            //сортировка отфильтрованного массива
            if (sortKey) {
                info = info.slice().sort(function (a, b) {
                    a = a[sortKey];
                    b = b[sortKey];
                    if (sortKey === 'Логин' || sortKey === 'Статус') {
                        a = a.toLowerCase();
                        b = b.toLowerCase();
                    }
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                });
            }
            return info;
        },



        //сортировка порядков
        sortOrders() {
            const columnSortOrders = {};
            this.columns.forEach(function (key) {
                columnSortOrders[key] = 1;
            });

            return columnSortOrders;
        },
    },


    //методы
    methods: {
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        },

        sortBy(key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        },

    }
})

app.mount('#demo')
