const studentListModels = require('../Models/StudentListModels.js')

// CONTROLLERS POR MÉTODO    

// =-=-=-=-= POST =-=-=-=-=
exports.getStudents = async (req, res) => {
    const studentList = new studentListModels()
    try {
        const students = await studentList.get()
        console.log(students)
        return  res.status(200).json({message: "Alunos Listados com Sucesso!", students})
        
        
    } catch (error) {
        return res.status(500).json({message: "Erro interno no Servidor!"})
    }
}