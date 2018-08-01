namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class infoGralTipoAcceso3 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("MT.InformeTFgeneral", "AccesoTipo");
            AddForeignKey("MT.InformeTFgeneral", "AccesoTipo", "MT.cat_TipoAcceso", "TipoAccesoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("MT.InformeTFgeneral", "AccesoTipo", "MT.cat_TipoAcceso");
            DropIndex("MT.InformeTFgeneral", new[] { "AccesoTipo" });
        }
    }
}
