namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class inicial01 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.PersonalProyecto",
                c => new
                    {
                        PersonalProyectoId = c.Long(nullable: false, identity: true),
                        ProyectoId = c.String(nullable: false, maxLength: 10),
                        numEmpleado = c.String(nullable: false, maxLength: 10),
                    })
                .PrimaryKey(t => t.PersonalProyectoId)
                .ForeignKey("CH.tab_Usuario", t => t.numEmpleado, cascadeDelete: true)
                .ForeignKey("GEN.Proyectos", t => t.ProyectoId, cascadeDelete: true)
                .Index(t => t.ProyectoId)
                .Index(t => t.numEmpleado);
            
            /*CreateTable(
                "CH.tab_Usuario",
                c => new
                    {
                        numEmpleado = c.String(nullable: false, maxLength: 10),
                        nombreEmpleado = c.String(maxLength: 80),
                        apellidoPaterno = c.String(maxLength: 80),
                        apellidoMaterno = c.String(maxLength: 80),
                        fechaIngreso = c.DateTime(nullable: false),
                        gerencia = c.String(maxLength: 80),
                        categoriaActual = c.String(maxLength: 80),
                        antiguedad = c.String(maxLength: 10),
                    })
                .PrimaryKey(t => t.numEmpleado);
            
            CreateTable(
                "GEN.Proyectos",
                c => new
                    {
                        ProyectoId = c.String(nullable: false, maxLength: 10),
                        Nombre = c.String(maxLength: 200),
                        NumjefeProyecto = c.String(maxLength: 10),
                        NombreJefeProyecto = c.String(maxLength: 200),
                        FechaInicio = c.DateTime(nullable: false),
                        FechaFin = c.DateTime(nullable: false),
                        Gerencia = c.String(maxLength: 10),
                        SubPrograma = c.String(maxLength: 10),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.ProyectoId);*/
            
        }
        
        public override void Down()
        {
            /*DropForeignKey("GEN.PersonalProyecto", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("GEN.PersonalProyecto", "numEmpleado", "CH.tab_Usuario");
            DropIndex("GEN.PersonalProyecto", new[] { "numEmpleado" });
            DropIndex("GEN.PersonalProyecto", new[] { "ProyectoId" });
            DropTable("GEN.Proyectos");
            DropTable("CH.tab_Usuario");*/
            DropTable("GEN.PersonalProyecto");
        }
    }
}
