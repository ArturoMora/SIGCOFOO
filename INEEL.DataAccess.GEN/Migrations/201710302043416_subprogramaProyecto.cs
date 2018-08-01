namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class subprogramaProyecto : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.cat_SubProgramaProyecto",
                c => new
                    {
                        SubProgramaProyectoId = c.Int(nullable: false, identity: true),
                        Clave = c.String(),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.SubProgramaProyectoId);
            
        }
        
        public override void Down()
        {
            DropTable("GEN.cat_SubProgramaProyecto");
        }
    }
}
