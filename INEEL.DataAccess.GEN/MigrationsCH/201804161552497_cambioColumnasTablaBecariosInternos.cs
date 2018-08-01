namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambioColumnasTablaBecariosInternos : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_BecarioInterno", "BecarioDirigidoId", "CH.tab_BecarioDirigido");
            DropIndex("CH.tab_BecarioInterno", new[] { "BecarioDirigidoId" });
            AddColumn("CH.tab_BecarioInterno", "Notas", c => c.String());
            AddColumn("CH.tab_BecarioInterno", "Descripcion", c => c.String());
            DropColumn("CH.tab_BecarioInterno", "BecarioDirigidoId");
        }
        
        public override void Down()
        {
            AddColumn("CH.tab_BecarioInterno", "BecarioDirigidoId", c => c.Int());
            DropColumn("CH.tab_BecarioInterno", "Descripcion");
            DropColumn("CH.tab_BecarioInterno", "Notas");
            CreateIndex("CH.tab_BecarioInterno", "BecarioDirigidoId");
            AddForeignKey("CH.tab_BecarioInterno", "BecarioDirigidoId", "CH.tab_BecarioDirigido", "BecarioDirigidoId");
        }
    }
}
