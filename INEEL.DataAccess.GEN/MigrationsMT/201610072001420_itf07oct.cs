namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class itf07oct : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTecnicoFinal", "clasificacionSignatura", c => c.String(maxLength: 100));
            AddColumn("MT.InformeTecnicoFinal", "numeroInforme", c => c.String(maxLength: 50));
            AlterColumn("MT.InformeTFgeneral", "Resumen", c => c.String(nullable: false, storeType: "ntext"));
        }
        
        public override void Down()
        {
            AlterColumn("MT.InformeTFgeneral", "Resumen", c => c.String(nullable: false, maxLength: 300));
            DropColumn("MT.InformeTecnicoFinal", "numeroInforme");
            DropColumn("MT.InformeTecnicoFinal", "clasificacionSignatura");
        }
    }
}
