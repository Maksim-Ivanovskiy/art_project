/* import checkNumInputs from './checkNumInputs'; */

const forms = () => {
   const form = document.querySelectorAll('form'),
         inputs = document.querySelectorAll('input'),
         upload = document.querySelectorAll('[name="upload"]');


    /* checkNumInputs('input[name="user_phone"]'); */

    const message = {
        loading: 'Загрузка',
        success: 'Спасибо! Скоро мы с вами свяжемся!',  //создаем объект с сообщениями, которые будут показываться пользователю
        failure: 'Что-то пошло не так...',
        spinner: 'assets/img/spinner.gif',
        ok: 'assets/img/ok.png',
        fail: 'assets/img/fail.png'
    };

    const path = {
        designer: 'assets/server.php',
        question: 'assets/question.php'
    };


    const postData = async (url, data) => {
           
        let res = await fetch(url, {
            method: "POST",
            body: data
        });

        return await res.text();
    };  

    const clearInputs = () => {
        inputs.forEach(item => {
            item.value = '';                    //функция по очищению всех инпутов
        });
        upload.forEach(item => {
            item.previousElementSibling.textContent = "Фал не выбран";
        });
    };

    upload.forEach(item => {
        item.addEventListener('input', () => {
            console.log(item.files[0]);
            let dots;
            let arr = item.files[0].name.split('.');
            if(arr[0].length > 6) {
                dots = "...";
            } else {
                dots = ".";
            }
            const name = arr[0].substring(0, 6) + dots + arr[1];
            item.previousElementSibling.textContent = name;
        });
    });

    form.forEach(item => {
        item.addEventListener('submit', (e) => {        //перебираем все формы, навешиваем обработчик события, создаем блок, в котором будем показывать пользователю, что что-то пошло не так, либо запрос отправился.
            e.preventDefault();     

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            item.parentNode.appendChild(statusMessage);

            item.classList.add('animated', 'fadeOutUp');
            setTimeout(() => {
                item.style.display = 'none';
            }, 400);

            let statusImg = document.createElement('img');
            statusImg.setAttribute('src', message.spinner);
            statusImg.classList.add('animated', 'fadeInUp');
            statusMessage.appendChild(statusImg);

            let textMessage = document.createElement('div');
            textMessage.textContent = message.loading;
            statusMessage.appendChild(textMessage);

            const formData = new FormData(item);        //собираем все введенные данные из этой формы   
            let api;
            if(item.closest('.popup-design') || item.classList.contains('calc_form')) {
                api = path.designer;
            } else {
                api = path.question;
            } 

            postData(api, formData)     //отправляем запрос на сервер по адресу в первом документе с даннымы, который получил formData
                .then(res => {
                    console.log(res);
                    statusImg.setAttribute('src', message.ok);
                    textMessage.textContent = message.success;
                })
                .catch(() => {
                    statusImg.setAttribute('src', message.fail);
                    textMessage.textContent = message.failure;
                })
                .finally(() => {
                    clearInputs();
                    setTimeout(() => {
                        statusMessage.remove();
                        item.style.display = 'block';
                        item.classList.remove('fadeOutUp');
                        item.classList.add('fadeInUp');
                    }, 5000);
                });

        });
    });
};

export default forms;

