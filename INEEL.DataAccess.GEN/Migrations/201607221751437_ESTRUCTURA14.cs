namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ESTRUCTURA14 : DbMigration
    {
        public override void Up()
        {
            /*DropForeignKey("GEN.PersonalProyecto", "numEmpleado", "CH.tab_Usuario");
            DropIndex("GEN.PersonalProyecto", new[] { "numEmpleado" });
            DropColumn("GEN.PersonalProyecto", "numEmpleado");
            DropTable("CH.tab_Usuario");*/
        }
        
        public override void Down()
        {
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
            
            AddColumn("GEN.PersonalProyecto", "numEmpleado", c => c.String(nullable: false, maxLength: 10));
            CreateIndex("GEN.PersonalProyecto", "numEmpleado");
            AddForeignKey("GEN.PersonalProyecto", "numEmpleado", "CH.tab_Usuario", "numEmpleado", cascadeDelete: true);*/
        }
    }
}
