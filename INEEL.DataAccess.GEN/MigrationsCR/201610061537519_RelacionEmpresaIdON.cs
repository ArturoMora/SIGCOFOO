namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RelacionEmpresaIdON : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "empresaId", c => c.Int());
            CreateIndex("CR.tab_OportunidadNegocios", "empresaId");
            AddForeignKey("CR.tab_OportunidadNegocios", "empresaId", "CR.cat_Empresas", "EmpresaId");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_OportunidadNegocios", "empresaId", "CR.cat_Empresas");
            DropIndex("CR.tab_OportunidadNegocios", new[] { "empresaId" });
            DropColumn("CR.tab_OportunidadNegocios", "empresaId");
        }
    }
}
