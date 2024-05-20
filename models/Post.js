const { Schema, model} = require('mongoose');

const PostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    title: { type: String, required: true },
    message: { type: String },
    files: [{ type: String }],
    changeable: { type: Boolean, default: false, immutable: true },
    repeat: { type: Number, default: 1 },
    receiver: { type: String },

    nextShowAt: { type: Date },
    showAfter: { type: Number, default: 0 }, // Интервал в миллисекундах
}, { timestamps: true });

PostSchema.methods.updateNextShowAt = function() {
    if (this.repeat > 0 && this.showAfter > 0) {
        // Если nextShowAt пустой, используем createdAt как начальную точку
        if (!this.nextShowAt) {
            this.nextShowAt = this.createdAt;
        }

        // Добавляем интервал к nextShowAt
        this.nextShowAt = new Date(this.nextShowAt.getTime() + this.showAfter);
        this.repeat -= 1; // Уменьшаем счетчик повторений
        this.save(); // Сохраняем изменения
    }
};

PostSchema.pre('save', function(next) {
    if (!this.changeable) {
        // Получаем список всех полей в схеме
        const fields = Object.keys(this.schema.paths);

        // Перебираем каждое поле и устанавливаем immutable = true
        fields.forEach(field => {
            console.log('FILED', field);
            if (
                this[field]?.immutable &&
                !['repeat', 'changeable', 'nextShowAt'].includes(field)
            ) {
                this[field].immutable = true;
            }
        });
    }
    next();
});


PostSchema.pre('validate', function(next) {
    // Проверяем, были ли модифицированы поля, связанные с показами и интервалами
    const isNextShowAtModified = this.isModified('nextShowAt');
    const isShowAfterModified = this.isModified('showAfter');
    const isRepeatModified = this.isModified('repeat');

    if (this.isNew || isNextShowAtModified || isShowAfterModified || isRepeatModified) {
        console.log('/////', this.nextShowAt, this.showAfter);
        if ((!this.nextShowAt && this.showAfter === 0) || (this.nextShowAt && this.showAfter > 0)) {
            return next(new Error('For new posts, either nextShowAt or showAfter must be set, but not both.'));
        }

        if (!this.isNew && this.repeat < 1 && this.nextShowAt) {
            return next(new Error('For posts with no repeats left, setting nextShowAt is not required.'));
        }
    } else if (!this.isNew && !this.changeable) {
        return next(new Error('Its post not changeable.'));
    }

    next(); // Продолжаем, если нет ошибок или если изменения не затрагивают даты и интервалы
});



const Post = model('Post', PostSchema);
module.exports = Post;

/*
PostSchema.pre('save', function (next) {
    if (this.showAfter) {
        const showAfter = this.showAfter
        const showAt = new Date()

        showAt.setFullYear(showAt.getFullYear() + showAfter.years)
        showAt.setMonth(showAt.getMonth() + showAfter.months)
        showAt.setDate(showAt.getDate() + showAfter.days)
        showAt.setHours(showAt.getHours() + showAfter.hours)
        showAt.setMinutes(showAt.getMinutes() + showAfter.minutes)

        this.nextShowAt = showAt
    }

    next()
})
*/

