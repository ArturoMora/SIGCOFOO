namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class aliados3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_Aliado", "EmpresaId", c => c.Int(nullable: false));
            CreateIndex("CR.tab_Aliado", "EmpresaId");
            AddForeignKey("CR.tab_Aliado", "EmpresaId", "CR.cat_Empresas", "EmpresaId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_Aliado", "EmpresaId", "CR.cat_Empresas");
            DropIndex("CR.tab_Aliado", new[] { "EmpresaId" });
            DropColumn("CR.tab_Aliado", "EmpresaId");
        }
    }
}
