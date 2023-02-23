const app = Vue.createApp({
    el: '#demo',
    data() {
        return {
            searchFilter: '',
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
        filterKey: String
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
            const filterKey = this.filterKey && this.filterKey.toLowerCase()
            const order = this.sortOrders[sortKey] || 1;
            let info = this.info;
            if (filterKey) {
                info = info.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return (
                            key !== "Место" && //выключение фильтра для столбца "Место"
                            String(row[key])
                                .toLowerCase()
                                .indexOf(filterKey) > -1
                        );
                    });
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

