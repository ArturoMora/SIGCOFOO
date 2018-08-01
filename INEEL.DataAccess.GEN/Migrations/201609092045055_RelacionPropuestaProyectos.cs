namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RelacionPropuestaProyectos : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.Propuestas", "EmpresaId", c => c.Int());
            CreateIndex("GEN.Propuestas", "EmpresaId");
            AddForeignKey("GEN.Propuestas", "EmpresaId", "CR.cat_Empresas", "EmpresaId");
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.Propuestas", "EmpresaId", "CR.cat_Empresas");
            DropIndex("GEN.Propuestas", new[] { "EmpresaId" });
            DropColumn("GEN.Propuestas", "EmpresaId");
        }
    }
}
